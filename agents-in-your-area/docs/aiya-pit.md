# aiya-pit

> ここで暴れろ — サンドボックス

<!-- TODO(translation): 本文を英語化する。 -->
<!-- NOTE: 全体アーキテクチャ図・セキュリティモデル・モノレポ構成表は ../README.md に集約した。 -->

AIエージェントがホスト環境に影響を与えずに全力で作業できる隔離環境を提供する。Dockerfile・ファイルシステム隔離・ネットワーク隔離・CA証明書管理の4つが主な構成要素。

## Quickstart

<!-- TODO: docker compose up 一発で動く手順 -->

```
# TODO
```

## Container image

- Claude Code実行に必要なツールチェーン一式（Node.js, Git, 各種ビルドツール）
- `--dangerously-skip-permissions` での起動を前提とした環境
- CA証明書の信頼設定（各ツール向け: npm, pip, curl, Node.js等）

## Filesystem isolation

- bind mountで作業ディレクトリ（git worktree）のみ `/workspace` にマウント
- ホストの `~/.ssh`, `~/.gitconfig` 等には一切アクセス不可
- コンテナ内の変更はworktree内に閉じる

## Network isolation

- Docker networkの `internal: true` でCCコンテナの外部アクセスを物理的に遮断
- internal networkにCCコンテナとaiya-proxyを配置
- aiya-proxyだけが外部ネットワーク（bridge）にも接続し、外部通信を中継
- CCコンテナから外部への直接TCP接続は不可能
- `ANTHROPIC_BASE_URL` をaiya-proxyに向けてAPI通信も記録対象に

## CA certificate management

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

## docker-compose

`cc-template` サービスの定義例：

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

## Single use (without aiya-tape)

aiya-pit はプロキシなしでも使える。その場合:
- ファイルシステム隔離のみ有効
- ネットワーク制限・MITM・監査機能は無効
- `HTTP_PROXY` / `HTTPS_PROXY` / `ANTHROPIC_BASE_URL` を設定しなければ直接通信

## Related documents

- [aiya-tape.md](aiya-tape.md) — 監査プロキシ（aiya-pitと組み合わせて使う）
- [../README.md](../README.md) — 全体アーキテクチャ図とセキュリティモデル

## Open questions

- [ ] CA証明書の配布方法（共有ボリューム or init container or entrypoint script）
- [ ] ベースイメージの選定（ubuntu:24.04 or node:lts or カスタム）
- [ ] コンテナ内のユーザー権限（root vs non-root）
