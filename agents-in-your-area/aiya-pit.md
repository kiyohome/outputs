# aiya-pit

> ここで暴れろ — サンドボックス環境

AIエージェントが安全に全力で動けるDockerベースのサンドボックス。ファイルアクセスをリポジトリ境界に制限し、ネットワークをプロキシ経由に強制する。

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

ネットワーク制限（Docker network）:
- Docker networkの `internal` 設定でCCコンテナの外部アクセスを物理的に遮断
- CCコンテナからはaiya-proxyにしか到達できない構成
- aiya-proxyだけが外部ネットワークに接続し、ドメイン許可リストで制御

### リポジトリ構成

| リポジトリ | 要件 | 思想 | 中身 |
|---|---|---|---|
| **aiya** | 統合 | AIYAフル体験 | CLI + docker-compose |
| **aiya-pit** | サンドボックス | ここで暴れろ | Dockerfile, CA証明書, ネットワーク制限 |
| **aiya-tape** | 監査 | テープ回してるぞ | Goプロキシ, OpenObserve構成 |
| **aiya-jam** | タスク管理 | 一緒にやろう | SKILL.md, ワークフロー定義 |

pit（モッシュピット）、tape（録音テープ）、jam（ジャムセッション）。全部1音節、全部音楽。

---

## aiya-pit の要件

### 目的

AIエージェントがホスト環境に影響を与えずに全力で作業できる隔離環境を提供する。

### 提供するもの

**Dockerfile:**
- Claude Code実行に必要なツールチェーン一式（Node.js, Git, 各種ビルドツール）
- `--dangerously-skip-permissions` での起動を前提とした環境
- CA証明書の信頼設定（各ツール向け: npm, pip, curl, Node.js等）

**ファイルシステム隔離:**
- bind mountで作業ディレクトリ（git worktree）のみ `/workspace` にマウント
- ホストの `~/.ssh`, `~/.gitconfig` 等には一切アクセス不可
- コンテナ内の変更はworktree内に閉じる

**ネットワーク隔離:**
- Docker networkの `internal: true` でCCコンテナの外部アクセスを物理的に遮断
- internal networkにCCコンテナとaiya-proxyを配置
- aiya-proxyだけが外部ネットワーク（bridge）にも接続し、外部通信を中継
- CCコンテナから外部への直接TCP接続は不可能
- `ANTHROPIC_BASE_URL` をaiya-proxyに向けてAPI通信も記録対象に

**CA証明書管理:**
- HTTPS MITM用の自前CA証明書をコンテナ内に注入
- CA秘密鍵はコンテナ起動時に毎回生成、揮発（永続化しない）
- CA秘密鍵はCCの作業ディレクトリ外に配置 + パーミッション制限
- 各ツールへの証明書設定:
  - システム: `update-ca-certificates`
  - Node.js: `NODE_EXTRA_CA_CERTS`
  - npm: `cafile`
  - pip: `REQUESTS_CA_BUNDLE`
  - curl: `CURL_CA_BUNDLE`
  - git: `http.sslCAInfo`

### docker-compose（cc-templateサービス）

```yaml
cc-template:
  build: ./docker
  environment:
    - ANTHROPIC_BASE_URL=http://aiya-proxy:8080
    - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    - NODE_EXTRA_CA_CERTS=/etc/ssl/certs/aiya-ca.crt
    - REQUESTS_CA_BUNDLE=/etc/ssl/certs/aiya-ca.crt
    - CURL_CA_BUNDLE=/etc/ssl/certs/aiya-ca.crt
  volumes:
    - type: bind
      source: ${WORKTREE_PATH}
      target: /workspace
  networks: [sandbox]       # internal networkのみ → 外部直接アクセス不可
  profiles: [cc]

# aiya-proxyは両方のネットワークに接続（pitドキュメントでは参考情報）
# aiya-proxy:
#   networks: [sandbox, external]

networks:
  sandbox:
    internal: true            # 外部アクセス遮断
  external:
    driver: bridge            # aiya-proxyだけがこちらに接続
```

### 単独利用（aiya-tape なし）

aiya-pit はプロキシなしでも使える。その場合:
- ファイルシステム隔離のみ有効
- ネットワーク制限・MITM・監査機能は無効
- `HTTP_PROXY` / `HTTPS_PROXY` / `ANTHROPIC_BASE_URL` を設定しなければ直接通信

### 未決事項

- CA証明書の配布方法（共有ボリューム or init container or entrypoint script）
- ベースイメージの選定（ubuntu:24.04 or node:lts or カスタム）
- コンテナ内のユーザー権限（root vs non-root）
