# aiya-tape

> テープ回してるぞ — 監査・可視化

<!-- TODO(translation): 本文を英語化する。 -->
<!-- NOTE: 全体アーキテクチャ図・セキュリティモデル・モノレポ構成表は ../README.md に集約した。 -->

AIエージェントの全通信を記録・可視化し、「何が起きたか」を事後に追跡可能にする。aiya-tape は2つのコンポーネントで成り立つ：**aiya-proxy**（Goプロキシによる通信の捕捉・制御・投入）と **OpenObserve**（蓄積・クエリ・ダッシュボード・MCP）。

## Quickstart

<!-- TODO: docker compose up からダッシュボードまでの手順 -->

```
# TODO
```

## MCP integration

```bash
claude mcp add o2 http://localhost:5080/api/default/mcp \
  -t http --header "Authorization: Basic <TOKEN>"
```

OpenObserve内蔵MCPでストリーム検索、アラート管理等が可能。自前MCPサーバーは不要。

## aiya-proxy

**技術:** Go + goproxy

**責務:**

1. **APIゲートウェイ** — `ANTHROPIC_BASE_URL` 差し替え、Anthropic API通信の全量記録（リクエスト/レスポンス、トークン数、レイテンシ）
2. **HTTPS MITM** — goproxyによる全HTTPS通信の中身記録
3. **ドメイン許可/拒否** — 許可リスト外のドメインへの接続をブロック
4. **OpenObserveへ投入** — 記録データをHTTP APIで送信
5. **センシティブ情報マスキング** — Authorizationヘッダー、APIキー等を記録前にマスク

### HTTPS MITM

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

### Recorded data

| 種別 | 内容 |
|---|---|
| Anthropic API | リクエストbody、レスポンスbody、モデル名、トークン数、レイテンシ |
| 一般HTTPS | メソッド、URL、ステータスコード、リクエスト/レスポンスサイズ |
| ブロック | 拒否されたドメインとリクエスト内容 |

### docker-compose

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

## OpenObserve

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

### docker-compose

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

## Single use (without aiya-pit)

aiya-tape はサンドボックスなしでも使える。その場合:
- ホスト上で動くCCの `HTTP_PROXY` / `HTTPS_PROXY` をプロキシに向ける
- `ANTHROPIC_BASE_URL` をプロキシに向ける
- ファイルシステム隔離は無効、ネットワーク監査のみ有効

## Related documents

- [aiya-pit.md](aiya-pit.md) — サンドボックス（aiya-tapeと組み合わせて使う）
- [../README.md](../README.md) — 全体アーキテクチャ図とセキュリティモデル

## Open questions

- [ ] プロキシのドメイン許可/拒否リストの管理方法（設定ファイル or 環境変数 or API）
- [ ] ダッシュボードのプリセット構成（初期テンプレートで何を表示するか）
- [ ] ログのリテンション（保持期間の設定方法）
- [ ] マスキングルールの管理方法（正規表現ベース or パターンマッチ）
