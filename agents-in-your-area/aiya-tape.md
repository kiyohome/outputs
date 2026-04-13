# aiya-tape

> テープ回してるぞ — 監査・可視化

AIエージェントの全通信を記録・可視化する監査基盤。Goプロキシで通信を捕捉し、OpenObserveで蓄積・ダッシュボード表示する。

---

## 背景

### アーキテクチャ

```
┌─────────────────────────────────────────────────────┐
│  Host (WSL2/Ubuntu)                                 │
│                                                     │
│  ┌──────────┐                                       │
│  │ aiya CLI │ (Bash)                                │
│  │ tmux     │ ターミナルマルチプレクサ                 │
│  └────┬─────┘                                       │
│       │ docker compose / git worktree               │
│       ▼                                             │
│  ┌──────────────────────────────────────────────┐   │
│  │  Docker Network                              │   │
│  │                                              │   │
│  │  ┌──────────┐    ┌───────────────────────┐   │   │
│  │  │ CC       │───▶│ aiya-proxy            │   │   │
│  │  │ Container│    │ (Go + goproxy)        │   │   │
│  │  │ ×N       │    │                       │   │   │
│  │  └──────────┘    │ • APIゲートウェイ       │   │   │
│  │                  │ • HTTPS MITM          │   │   │
│  │                  │ • ドメイン許可/拒否      │   │   │
│  │                  │ • マスキング            │   │   │
│  │                  └───────┬───────────────┘   │   │
│  │                          │ HTTP API          │   │
│  │                          ▼                   │   │
│  │                  ┌───────────────────────┐   │   │
│  │                  │ OpenObserve           │   │   │
│  │                  │                       │   │   │
│  │                  │ • ログストレージ        │   │   │
│  │                  │ • ダッシュボード        │   │   │
│  │                  │ • 内蔵MCP             │   │   │
│  │                  │ • SQLクエリ            │   │   │
│  │                  └───────────────────────┘   │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### セキュリティモデル

2層構造: **早期検知** + **実行時制御**

**Layer 1: PreToolUse Hooks（早期検知）**

Claude Codeのフック機構。ツール実行前にルールを評価し、不審な操作を検知・警告する。
検知のみで、バイパス可能。

**Layer 2: Docker + Proxy（実行時制御）**

実際の制限はここで担保する。

ファイルアクセス制限（Docker）:
- 作業ディレクトリのみマウント（bind mount）
- ホストのファイルシステムにアクセス不可

ネットワーク制限（Proxy）:
- 全通信をプロキシ経由に強制（HTTP_PROXY / HTTPS_PROXY）
- ドメイン許可リストで外部アクセスを制御

### リポジトリ構成

| リポジトリ | 要件 | 思想 | 中身 |
|---|---|---|---|
| **aiya** | 統合 | AIYAフル体験 | CLI + docker-compose |
| **aiya-pit** | サンドボックス | ここで暴れろ | Dockerfile, CA証明書, ネットワーク制限 |
| **aiya-tape** | 監査 | テープ回してるぞ | Goプロキシ, OpenObserve構成 |
| **aiya-jam** | タスク管理 | 一緒にやろう | SKILL.md, ワークフロー定義 |

pit（モッシュピット）、tape（録音テープ）、jam（ジャムセッション）。全部1音節、全部音楽。

---

## aiya-tape の要件

### 目的

AIエージェントの全通信を記録・可視化し、「何が起きたか」を事後に追跡可能にする。

### 構成要素

aiya-tape は2つのコンポーネントで成り立つ:

1. **aiya-proxy** — 通信の捕捉・制御・投入
2. **OpenObserve** — 蓄積・クエリ・ダッシュボード・MCP

### aiya-proxy（Goプロキシ）

**技術:** Go + goproxy

**責務:**

1. **APIゲートウェイ** — `ANTHROPIC_BASE_URL` 差し替え、Anthropic API通信の全量記録（リクエスト/レスポンス、トークン数、レイテンシ）
2. **HTTPS MITM** — goproxyによる全HTTPS通信の中身記録
3. **ドメイン許可/拒否** — 許可リスト外のドメインへの接続をブロック
4. **OpenObserveへ投入** — 記録データをHTTP APIで送信
5. **センシティブ情報マスキング** — Authorizationヘッダー、APIキー等を記録前にマスク

**HTTPS MITM:**

CONNECTトンネルではドメインしか見えない。不審な外部通信で「何を送ったか分からない」は監査として致命的。
→ 自前CA証明書でMITMし、全HTTPS通信の中身を記録する。

セキュリティ対策:

| リスク | 対策 |
|---|---|
| CA秘密鍵漏洩 | コンテナ起動時に毎回生成、揮発 |
| CCがCA秘密鍵にアクセス | 作業ディレクトリ外 + パーミッション制限 |
| 認証情報がログに残る | Authorizationヘッダー等マスキング |
| 証明書検証エラー | Dockerfile内で各ツールにCA証明書設定（aiya-pit側） |

倫理的妥当性: 自分が動かすAIエージェントの通信を自分で記録する。人間の通信は傍受しない。Docker Sandboxes、Vercel AI Gatewayも同様のプラクティス。

**記録するデータ:**

| 種別 | 内容 |
|---|---|
| Anthropic API | リクエストbody、レスポンスbody、モデル名、トークン数、レイテンシ |
| 一般HTTPS | メソッド、URL、ステータスコード、リクエスト/レスポンスサイズ |
| ブロック | 拒否されたドメインとリクエスト内容 |

**docker-compose:**

```yaml
aiya-proxy:
  build: ./proxy
  ports: ["8080:8080"]
  environment:
    - O2_ENDPOINT=http://openobserve:5080
    - O2_USER=root@example.com
    - O2_PASS=xxx
  depends_on: [openobserve]
```

### OpenObserve

**技術:** Rust製シングルバイナリ、AGPL-3.0（利用のみなら義務なし）

**選定理由:**
1. HTTP APIで投入・クエリが簡単
2. ダッシュボード内蔵（Grafana不要）
3. 公式MCPサーバー内蔵 → 自前MCP不要
4. SQLでクエリ可能
5. Dockerイメージ1つ
6. 19種+カスタムチャート（ECharts）
7. ローカルディスクストレージ対応

**想定データ量:** 1日数MB〜数百MB。OSS版の無制限で十分。

**MCP連携:**

```bash
claude mcp add o2 http://localhost:5080/api/default/mcp \
  -t http --header "Authorization: Basic <TOKEN>"
```

OpenObserve内蔵MCPでストリーム検索、アラート管理等が可能。自前MCPサーバーは不要。

**docker-compose:**

```yaml
openobserve:
  image: public.ecr.aws/zinclabs/openobserve:latest
  ports: ["5080:5080"]
  volumes: [o2data:/data]
  environment:
    - ZO_DATA_DIR=/data
    - ZO_ROOT_USER_EMAIL=root@example.com
    - ZO_ROOT_USER_PASSWORD=xxx
```

### 単独利用（aiya-pit なし）

aiya-tape はサンドボックスなしでも使える。その場合:
- ホスト上で動くCCの `HTTP_PROXY` / `HTTPS_PROXY` をプロキシに向ける
- `ANTHROPIC_BASE_URL` をプロキシに向ける
- ファイルシステム隔離は無効、ネットワーク監査のみ有効

### 未決事項

- プロキシのドメイン許可/拒否リストの管理方法（設定ファイル or 環境変数 or API）
- ダッシュボードのプリセット構成（初期テンプレートで何を表示するか）
- ログのリテンション（保持期間の設定方法）
- マスキングルールの管理方法（正規表現ベース or パターンマッチ）
