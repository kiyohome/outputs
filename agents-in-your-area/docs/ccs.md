# CCS (Compressed Cognitive State)

> Step間の引き継ぎを置換セマンティクスで管理する有界な状態表現

<!-- TODO(translation): 本文を英語化する。 -->

## Overview

### What is this

CCS（Compressed Cognitive State）は、AIエージェントがStep間で状態を引き継ぐための構造化された表現。論文「AI Agents Need Memory Control Over More Context」（Bousetouane, 2026）で提案されたAgent Cognitive Compressor（ACC）の考え方を、Claude Codeのエージェントスキルに適用したもの。

### Why it exists

従来のコンテキスト管理は2つの問題を抱えている。

| アプローチ | 問題点 |
|---|---|
| Transcript Replay | Contextが線形に増大し、初期のミスが繰り返し参照され、ドリフト・ハルシネーションが蓄積する |
| Retrieval-based Memory | 意味的類似性で検索するため、Task制御に必要な情報と一致しない。古い・矛盾した情報が混入しやすい |

CCSの解決策：

- **有界な状態管理** — 蓄積ではなく置換
- **Schemaによる構造化** — 何を保持すべきか明確に定義
- **Artifact参照とState Commitの分離** — 検索は候補提案のみで、実際の状態更新はSchemaに従って厳密に制御

### 9 Components

| Component | 役割 |
|---|---|
| episodic_trace | 直前のStepで何が起きたか |
| semantic_gist | 本質的に何をしているか |
| focal_entities | 何を扱っているか |
| relational_map | それらはどう関係するか |
| goal_orientation | 最終ゴールは何か |
| constraints | 何をしてはいけないか |
| predictive_cue | 次に何をすべきか |
| uncertainty_signal | 何がまだ不確かか |
| retrieved_artifacts | どこから情報を得たか |

---

## Usage

### Example: IT operations task

```
episodic_trace:
  observed(502 spikes after(enable(http2)))
  logged(nginx error upstream closed early)
  constraint(no restart during(business hours))

semantic_gist:
  mitigate(502) & diagnose(upstream instability)

focal_entities:
  host(vm ubuntu22 04)
  service(nginx)
  service(node upstream)
  feature(http2)
  signal(error 502)

relational_map:
  timing(502 spikes after(http2 enable))
  possible(upstream timeout 502)
  possible(upstream connection close 502)

goal_orientation:
  reduce(502 rate within(10min)) & preserve(service availability)

constraints:
  no_restart(nginx)
  reload_allowed(nginx)
  safe_change(minimal)
  avoid(speculation)

predictive_cue:
  check(upstream latency)
  check(node memory growth)
  validate(nginx timeouts)

uncertainty_signal:
  level(medium)
  gap(root cause not confirmed)

retrieved_artifacts:
  snippet(nginx error upstream prematurely closed)
  doc(recent change enable http2)
  doc(constraint note no restart)
```

### Example: Development task

```
episodic_trace:
  completed(design review)
  received(approval from tech lead)
  failed(first test run due to missing mock)

semantic_gist:
  implement(user authentication module)

focal_entities:
  file(src/auth/login.ts)
  function(validateCredentials)
  function(generateToken)
  function(refreshToken)
  interface(UserCredentials)
  interface(AuthToken)

relational_map:
  calls(login -> validateCredentials)
  depends(validateCredentials -> bcrypt)
  implements(LoginService -> IAuthService)

goal_orientation:
  achieve(auth module implementation)
  ensure(test coverage 80%+)

constraints:
  must(use bcrypt for password hashing)
  must_not(store plain text password)
  follow(project coding standards)
  avoid(external api call in unit test)

predictive_cue:
  next(generate test cases for validateCredentials)
  verify(token expiry handling)

uncertainty_signal:
  level(low)
  gap(token expiry time not specified in design)

retrieved_artifacts:
  spec(auth-module-spec.md)
  guide(CODING_STANDARDS.md)
```

### Size health

CCSが肥大化する場合は、Step設計を見直す。CCSのサイズは「Step設計の健全性指標」になる。

| 症状 | 原因 | 対処 |
|---|---|---|
| focal_entitiesが多すぎる | Stepの責務が広すぎる | Stepを分割する |
| relational_mapが複雑 | 一度に扱う関係が多すぎる | スコープを絞る |
| uncertainty_signalが多い | 未確定のまま進みすぎている | 確定させるStepを挟む |

---

## Architecture

### Format definition

CCSは以下の形式で記述する。

```
component_name:
  type(contents)
  type(contents)
  ...
```

| 要素 | 説明 |
|---|---|
| component_name | CCSを構成する9つの要素 |
| type | Component毎に定義された述語や型 |
| contents | 具体的な値や内容（自由記述） |

この形式は論文で「TOON style token-oriented representation」と呼ばれる。JSONやYAMLより軽量で、トークン効率を重視している。

### Type definition principle

typeはComponent毎に「何を表すか」を定義する。

| ポイント | 説明 |
|---|---|
| typeを限定する | 記述が安定し、エージェントが迷わず書ける |
| 読み手も予測しやすい | typeが決まっていれば解釈が一貫する |
| contentsは自由記述 | 具体的な内容はサンプルで示す |
| 語彙は固定ではない | 実際に使いながら調整する |

### Component schema

| Component | typeの定義 | typeサンプル（論文＋拡張） |
|---|---|---|
| episodic_trace | 動作の種類 | observed, executed, received, completed, failed, logged, constraint |
| semantic_gist | 作業の目的 | implement, fix, investigate, refactor, migrate, diagnose, mitigate |
| focal_entities | 対象物の種類 | file, function, class, interface, service, api, table, host, feature, signal |
| relational_map | 関係の種類 | depends, calls, implements, extends, before, after, timing, possible |
| goal_orientation | 達成の種類 | achieve, ensure, complete, deliver, verify, reduce, preserve |
| constraints | 制約の種類 | must, must_not, prefer, avoid, follow, no_restart, reload_allowed, safe_change |
| predictive_cue | 次の行動の種類 | next, verify, generate, check, test, review, validate |
| uncertainty_signal | 不確実性の種類 | level, gap, assumption, pending, unverified |
| retrieved_artifacts | 参照物の種類 | doc, code, log, config, spec, guide, snippet |

### Management principles

| 原則 | 説明 |
|---|---|
| 1ファイル1Task | TaskごとにCCSファイルを1つ作成する |
| Step毎に新規作成 | 蓄積ではなく、最新状態を新規作成する（置換セマンティクス） |
| コンテキスト非共有 | Task AgentとStep Agentはコンテキストを共有しない |
| CCSが唯一の橋渡し | Step間の引き継ぎはCCSのみ |

### Evaluation (paper findings)

ACC論文では、50ターンのマルチターン評価で以下の結果が得られている。

**メモリ使用量**

- Baseline（Transcript Replay）：ターン数に比例して線形増加
- Retrieval（Retrieval-based）：一定だが、検索エラーによるドリフトあり
- ACC：一定かつドリフトなし

**Task品質**

| 指標 | Baseline | Retrieval | ACC |
|---|---|---|---|
| Relevance | 中 | 中 | 高 |
| Answer Quality | 中 | 中 | 高 |
| Instruction Following | 低 | 中 | 高 |
| Coherence | 低 | 中 | 高 |

**ハルシネーション率・ドリフト率**

- Baseline：ターン数増加とともに上昇
- Retrieval：変動が大きい
- ACC：ほぼゼロで安定

### Relation to other documents

- [architecture.md](architecture.md) — CCS を生成・消費する Task/Context/Step/Action の構造
- [traceability-chain.md](traceability-chain.md) — `goal_orientation` / `constraints` / `retrieved_artifacts` にChain要素をどう接続するか
- [aiya-jam.md](aiya-jam.md) — CCS ファイルの保管・受け渡しを担うパッケージ

### Open questions

- [ ] Chain要素とCCSのリンク方式（参照 vs 展開コピー）
- [ ] CCSファイルの物理保管場所
- [ ] CCSのバージョニング（置換前の履歴を残すか）
- [ ] type語彙の拡張ルール

### References

- Bousetouane, F. (2026). AI Agents Need Memory Control Over More Context. arXiv:2601.11653v1
