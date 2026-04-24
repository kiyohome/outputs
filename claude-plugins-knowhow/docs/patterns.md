# パターン

> 単一のコンポーネント種別に紐づかない横断的なパターン。品質管理、状態管理、セキュリティ、上級テクニックを扱う。smith のパターンインスペクターはこれらと照合し、プラグイン作者はこれらを組み合わせて新しいプラグインを構成する。

**TODO**: 各パターンが公式プラグイン全体でどの程度の頻度で出現するかを定量化し、smith が検出をランキングする際の重み付けに使えるようにする。
**TODO**: 各パターンと対になるアンチパターンを収集する。smith のパターンインスペクターはそれらを照合対象として必要とする。

## 品質管理

### 自己信頼度のスコアリングと閾値フィルタリング

検出は 0〜100 のスケールでスコアリングされ、閾値以上のものだけが報告される。

| Score | 意味 |
|---|---|
| 0 | 誤検出。表面的なレビューでも捕捉される。既存の問題。 |
| 25 | やや自信あり。実在するかもしれないが未検証。スタイル上のもので、CLAUDE.md にも記載なし。 |
| 50 | 中程度の自信。実在するが軽微。PR との関係で重要ではない。 |
| 75 | 高い自信。再確認済み。実際に正しさに影響する。既存のアプローチでは不十分。 |
| 100 | 絶対的に確実。頻繁に起きる。証拠が直接これを支持する。 |

**共通の閾値は 80。** `feature-dev` の `code-reviewer` と `code-review` プラグインの双方がこれを使う。80 未満のものはすべて捨てられる。

### 誤検出を明示的に列挙する

`code-review` はそのコマンド内で「これらは誤検出である」というリストを明示的に含めている:

- 既存の問題（変更前から存在するもの）。
- lint / typecheck / CI が捕捉する問題。
- 厳密なスタイル上の細かい指摘。
- CLAUDE.md に記載があるが、コード上ですでに lint-ignore されている問題。
- 意図的なフィーチャー変更。
- 変更されていない行に関する問題。
- 一般的なコード品質の問題（CLAUDE.md で明示的に指定されていない限り）。

何を報告**しない**かを明言する方が、閾値を調整するよりも確実に精度を上げる。

### 二重の適格性チェック

`code-review` はレビュー開始前と、コメント投稿の直前に同じ適格性チェックを実行する:

```
Phase 1: Haiku eligibility check (closed? draft? automated PR? already reviewed?)
Phase 2–5: Review execution
Phase 6: Haiku re-eligibility check (PR state may have changed during review)
Phase 7: gh pr comment posts the result
```

これは長時間実行されるレビュー中の状態ドリフトに対する防御的設計である。

### 出力形式の規律

`code-review` は厳格な出力形式を強制する:

```markdown
### Code review

Found 3 issues:

1. <brief description> (CLAUDE.md says "<...>")
<link to file with full sha1 + line range>

2. <brief description> (bug due to <file and code snippet>)
<link to file with full sha1 + line range>
```

- 簡潔さ。
- 絵文字なし。
- すべての検出はコードへリンクし、引用すること。
- 完全な git SHA が必須（短縮 SHA やシェル展開は不可）。
- 行範囲は前後 1 行のコンテキストを含む（例: `L4-L7`）。

### レポーターと評価器の分離

詳細は Components > Agents で扱う。品質管理パターン群に属するためここでも再掲する: 自分の検出を自分でスコアリングするレビュアーには検出寄りのバイアスが生じる。役割を分割する（Sonnet が報告し、Haiku がスコアリングする）ことで、構造的にバイアスを取り除ける。

## 状態管理

### `.local.md` パターン: YAML フロントマター + Markdown 本文

```markdown
---
enabled: true
iteration: 3
max_iterations: 10
completion_promise: "All tests passing"
---

# Task Description

Fix all the linting errors in the project.
```

- `.claude/` 配下に置かれる。
- `.local.md` 拡張子は慣例として gitignore される。
- フロントマター = 構造化データ（設定、状態）。
- 本文 = 自由テキスト（プロンプト、説明）。
- フックスクリプトは `sed` / `awk` でこれを読み書きする。

実際の例:

- `ralph-loop`: ループ状態（イテレーション数、完了条件）。
- `hookify`: ルール定義（パターン、アクション）。
- `plugin-settings`: プラグイン設定（有効/無効、モード）。

### シェルからフロントマターを読み書きする

```bash
# フロントマターを抽出する。
FRONTMATTER=$(sed -n '/^---$/,/^---$/{ /^---$/d; p; }' "$STATE_FILE")

# フィールドを読み取る。
ENABLED=$(echo "$FRONTMATTER" | grep '^enabled:' | sed 's/enabled: *//' | sed 's/^"\(.*\)"$/\1/')

# 本文を抽出する（2 つ目の --- 以降すべて）。
BODY=$(awk '/^---$/{i++; next} i>=2' "$FILE")
```

### 進捗追跡のための `TodoWrite`

`feature-dev` は全フェーズを通じて組み込みの `TodoWrite` ツールを使う。コンテキストが大きくなっても、TODO リストは「今どこにいるのか」を示す安定したアンカーとして残る。状態が外部化されているため、Claude が現在地を見失うことはない。

## セキュリティ

フックはユーザー権限で動作し、サンドボックスはない。すべてのフックを特権コードとして扱うこと。

### 固定パターン vs 動的ルール

| プラグイン | スタイル | 性格 |
|---|---|---|
| security-guidance | 9 個のハードコードされたパターンを持つ Python スクリプト | 静的、決定論的 |
| hookify | 実行時に `.local.md` のルールを読み込む Python スクリプト | 動的、拡張可能 |

両者とも PreToolUse である。固定ポリシー（プラグインに組み込まれる）と動的なユーザールール（外部で記述される）の分離自体が、模倣する価値のある設計上の選択である。

### 代表的なセキュリティパターン

`security-guidance` は最低限以下を検出する:

- コマンドインジェクション。
- XSS。
- `eval` の使用。
- 危険な HTML。
- Pickle のデシリアライズ。
- `os.system` 呼び出し。
- さらに 3 つの内部パターン。

`hookify` は以下のルールを同梱する:

- `rm\s+-rf` — 危険な削除。
- `chmod\s+777` — 過度に緩いモード。
- `sudo\s+` — 権限昇格。
- `\.env$` — 環境ファイルの編集。
- `eval\(` — `eval` の使用。

### フックスクリプトの入力検証

すべてのフックスクリプトは stdin にパイプされる JSON データを検証しなければならない。呼び出し元が Claude Code であっても、信用してはならない。

```bash
set -euo pipefail

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name')

# ツール名の形式を検証する。
if [[ ! "$tool_name" =~ ^[a-zA-Z0-9_]+$ ]]; then
  echo '{"decision": "deny", "reason": "Invalid tool name"}' >&2
  exit 2
fi

# パストラバーサルを検出する。
file_path=$(echo "$input" | jq -r '.tool_input.file_path')
if [[ "$file_path" == *".."* ]]; then
  echo '{"decision": "deny", "reason": "Path traversal detected"}' >&2
  exit 2
fi
```

慣例:

- `set -euo pipefail` は必須。
- すべての変数展開を引用符で囲む。
- `exit 0` は成功、`exit 2` はブロックを意味する。
- 判断には構造化された JSON を出力する。

## 上級パターン

### 会話パターンマイニング (hookify)

`hookify` は `conversation-analyzer` エージェントを同梱する。これは過去の会話を遡り、以下を抽出する:

- 明示的な訂正要求（「X するな」「Y を止めろ」）。
- 不満の表明（「なぜ X したのか」「それを頼んだ覚えはない」）。
- ユーザーによる訂正と Claude の作業のロールバック。
- 繰り返される問題。

エージェントはその後、フックルールを自動的に合成する。**ルールは過去の失敗の歴史から育つ。** このプラグインは単なるルール実行器ではなく、開発者の苛立ちから学習する。

### 自己参照ループ (ralph-loop)

ここでの「自己参照」とは、出力に対するリフレクションを意味するわけではない。仕組みは以下のとおり:

1. 各イテレーションで同じプロンプトが再注入される。
2. Claude の以前の作業はファイルと git 履歴として永続化される。
3. 次のイテレーションで、Claude はそれらのファイルを読むことで前回何をしたかを「見る」。
4. フィードバックチャネルは出力に対する内省ではなく、ファイルシステムである。

根底にある哲学は「非決定論的な世界における決定論的な悪さ」。各イテレーションは予測可能な形で失敗し、失敗が予測可能であるからこそ、プロンプトのチューニングがそれを体系的に改善できる。

### ブラインド A/B 比較 (skill-creator)

`skill-creator` がスキルの 2 つのバージョンを比較するとき、*どちらがどちらかを伝えずに*両方を評価器エージェントに渡す。評価器は識別情報に基づいてバージョン A をバージョン B より優遇することができず、観測可能な品質に基づいてのみ評価できる。これにより、人間のバイアスと、以前見たバリアントへの Claude 自身のバイアスの両方が取り除かれる。

アーキテクチャは 2 段構成: ブラインドな判定を下す `comparator` エージェントと、その後に勝者がなぜ勝ったかを説明する `analyzer` エージェント。

### 長時間レビューにおける二重の適格性

`code-review` はレビュー開始前と結果投稿の直前に適格性をチェックする。レビューの最中に PR がクローズされたり、マージされたり、新しいコミットを受け取ったりする可能性がある。二度チェックすることで、古くなったフィードバックの投稿を防げる。

### コードの委任 (learning-output-style)

`learning-output-style` は、ユーザーに手書きで書いてもらう価値があるコードがどれかを判断する:

**ユーザーに委任する**:

- 妥当なアプローチが複数あるビジネスロジック。
- エラーハンドリング戦略。
- アルゴリズムの選択。
- データ構造の判断。

**委任しない**:

- ボイラープレート。
- 自明な実装。
- 設定コード。
- 単純な CRUD。

1 回のやり取りで、本当に重要なコードのうち 5〜10 行だけがユーザーに求められる。

### git worktree のための `clean_gone` (commit-commands)

git worktree を使った並列開発では「gone」状態のブランチが蓄積する。`commit-commands` はそれらを一括クリーンアップする:

```bash
git branch -v | grep '\[gone\]' | sed 's/^[+* ]//' | awk '{print $1}' | while read branch; do
  # まずこのブランチに紐づく worktree を削除する。
  worktree=$(git worktree list | grep "\\[$branch\\]" | awk '{print $1}')
  if [ ! -z "$worktree" ] && [ "$worktree" != "$(git rev-parse --show-toplevel)" ]; then
    git worktree remove --force "$worktree"
  fi
  git branch -D "$branch"
done
```

`+` プレフィックス（worktree に紐づくブランチ）が処理されている。これが正しい実装と区別される細部である。
