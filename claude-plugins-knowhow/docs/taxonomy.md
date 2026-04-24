# Taxonomy

> smith ナレッジベースから抽出したすべてのノウハウ項目の正規インデックス。各項目はドメイン、kebab-case の名前、および名前のイニシャルから派生した略式 ID を持つ。ESLint（kebab-case のルール名）、SpotBugs（`CATEGORY_ABBREV` パターンの ID）、TypeScript（安定的な数値コード）に着想を得ている。

## 範囲

Stage 3 で監査した 7 つの出典文書すべて（`smith-design.md` はその後 `../README.md` と `./design.md` に移行済み）。

- `concepts.md` — プラグインの形、アーキタイプ、設計原則。
- `components.md` — コンポーネント別の仕組み（コマンド / エージェント / スキル / フック）。
- `patterns.md` — 横断的な品質 / 状態 / セキュリティ / 高度なパターン。
- `case-studies.md` — 7 つの公式プラグインの掘り下げ。独立したノウハウを抽出。
- `checklists.md` — 品質チェックリスト。プロンプト/スキル/フック/CLAUDE.md の執筆ルールを抽出。
- `README.md` — smith の使い方とアーキテクチャ。フローパターンを抽出。
- `smith-design.md`（廃止） — 実装仕様。スコアリング、ランキング、パイプラインのパターンを抽出。

## ドメイン

5 つのドメイン。**ノウハウがどの目的に資するか**ではなく、**どの仕組みに対して作用するか**で分類する。

| Code | ドメイン | 作用対象 |
|---|---|---|
| `ARC` | アーキテクチャ | プラグインの形：ディレクトリレイアウト、アーキタイプ選定、レイヤー分離、運用スタンス。 |
| `SPC` | コンポーネント仕様 | コンポーネント別の仕組み：フロントマター、allowed-tools、events、hooks.json、フックスクリプトの規約、エージェントのインターフェース。 |
| `PRM` | プロンプト執筆 | `.md` プロンプト内のテキスト：声色、スタイル、範囲、出力指示、指示の品質。 |
| `FLW` | フロー | オーケストレーションと制御フロー：フェーズゲート、モデル階層化、ディスパッチ、品質スコアリング、改善パイプライン。 |
| `CTX` | コンテキストと状態 | 情報フロー、トリガリング、永続化：プログレッシブディスクロージャ、`.local.md`、セッション状態、CLAUDE.md 管理。 |

ある項目が 2 つのドメインにまたがり得る場合のタイブレークルール。

1. **コンポーネントのフィールドやファイル形式**を定義するなら → `SPC`。
2. **プロンプトの中に何を書くか**に関するなら → `PRM`。
3. **フェーズ、エージェント、階層がどう関係するか**に関するなら → `FLW`。
4. **ターン/セッション/イテレーションをまたいで何が永続するか**に関するなら → `CTX`。
5. それ以外で、**プラグインレベルの形**に関するなら → `ARC`。

## 命名と ID の規約

- **名前**：kebab-case、2〜4 単語、（目的ではなく）仕組みを表す。
- **ID**：`DOMAIN-INITIALS` の形式。`INITIALS` は名前の各単語の頭文字を大文字化したもの。ドメイン内で一意。
- **安定性**：いったん割り当てられた ID は安定。名前は細分化してよいが、ID が残るよう同じイニシャルを保つこと。
- **長さ**：ハイフンの後は 2〜4 文字。可変長は意図的（ESLint の前例）。

例：`three-layer-separation` → イニシャル `TLS` → ID `ARC-TLS`。

**TODO**: 2 文字 ID を視覚的な一貫性のためにパディングするか、そのまま残すか（規約として可変長を受け入れる）を決める。

## ARC — アーキテクチャ（10 項目）

| ID | 名前 | 出典 |
|---|---|---|
| `ARC-SDL` | standard-directory-layout | `concepts.md` §What is a Plugin |
| `ARC-ACA` | archetype-command-agent | `concepts.md` §Plugin Taxonomy |
| `ARC-ASO` | archetype-skill-only | `concepts.md` §Plugin Taxonomy |
| `ARC-AH`  | archetype-hybrid | `concepts.md` §Plugin Taxonomy |
| `ARC-TLS` | three-layer-separation | `concepts.md` §Core Design Patterns |
| `ARC-MVP` | minimum-viable-plugin | `concepts.md` §Standard directory layout (last sentence) |
| `ARC-AFD` | archetype-first-decision | `concepts.md` §Plugin Taxonomy (intro paragraph) |
| `ARC-CCH` | component-choice-heuristic | `case-studies.md` §claude-code-setup §Categories |
| `ARC-PNE` | propose-not-execute | `case-studies.md` §claude-code-setup + `README.md` §Shared principles |
| `ARC-AC`  | applicability-criteria | `case-studies.md` §ralph-loop §Suitable for / §Not suitable for |

## SPC — コンポーネント仕様（32 項目）

**TODO**: SPC（32 項目、taxonomy の 30%）について、現在のサブセクションを超えた恒久的なサブ軸が必要か、あるいは下記のサブセクションでナビゲーションとして十分かを決める。

### コマンド

| ID | 名前 | 出典 |
|---|---|---|
| `SPC-ATR` | allowed-tools-restriction | `components.md` §Commands |
| `SPC-ICE` | inline-command-execution | `components.md` §Commands |
| `SPC-AE`  | argument-expansion | `components.md` §Commands |

### エージェント

| ID | 名前 | 出典 |
|---|---|---|
| `SPC-AFM` | agent-front-matter | `components.md` §Agents |
| `SPC-EBT` | example-block-trigger | `components.md` §Agents |
| `SPC-CA`  | color-assignment | `components.md` §Agents |

### スキル

| ID | 名前 | 出典 |
|---|---|---|
| `SPC-SFM` | skill-front-matter | `components.md` §Skills |
| `SPC-DOM` | description-optimization-methodology | `components.md` §Skills |
| `SPC-STR` | skill-three-roles | `concepts.md` + `components.md` — canonical here |
| `SPC-DMI` | disable-model-invocation | `checklists.md` §Skill §1 Metadata |
| `SPC-RTT` | reference-toc-threshold | `checklists.md` §Skill §2 Progressive disclosure |
| `SPC-SFC` | skill-fork-context | `checklists.md` §Skill §6 CC-specific |
| `SPC-SAF` | skill-agent-field | `checklists.md` §Skill §6 CC-specific |

### フック

| ID | 名前 | 出典 |
|---|---|---|
| `SPC-HER` | hook-events-roster | `components.md` §Hooks |
| `SPC-THT` | two-hook-types | `components.md` §Hooks |
| `SPC-HJF` | hooks-json-format | `components.md` §Hooks |
| `SPC-PRV` | plugin-root-variable | `components.md` §Hooks |
| `SPC-SSI` | session-start-injection | `components.md` §Representative hook patterns |
| `SPC-PTL` | pretool-two-layer | `components.md` + `patterns.md` — canonical here |
| `SPC-HAR` | hook-applicability-rule | `checklists.md` §Hook §1 |
| `SPC-HSV` | hook-stderr-visibility | `checklists.md` §Hook §3 I/O design |
| `SPC-HI`  | hook-idempotency | `checklists.md` §Hook §5 Execution |

### フックスクリプトの規約

| ID | 名前 | 出典 |
|---|---|---|
| `SPC-FMS` | front-matter-shell-io | `patterns.md` §State Management |
| `SPC-SDS` | security-detector-set | `patterns.md` §Security |
| `SPC-HIV` | hook-input-validation | `patterns.md` §Security |
| `SPC-CGW` | clean-gone-worktrees | `patterns.md` §Advanced Patterns |

### プラグインファイル

| ID | 名前 | 出典 |
|---|---|---|
| `SPC-MSF` | mcp-server-file | `concepts.md` §Standard directory layout (`.mcp.json` row) |

### マルチエージェントのインターフェース

| ID | 名前 | 出典 |
|---|---|---|
| `SPC-FS`  | finding-schema | `smith-design.md` §Interfaces §Finding schema |
| `SPC-FTT` | finding-type-taxonomy | `smith-design.md` §Interfaces §`finding_type` naming convention |
| `SPC-PCF` | patch-content-format | `smith-design.md` §Interfaces §`patch_content` format |
| `SPC-AJT` | agent-json-transport | `smith-design.md` §Interfaces §Agent/script data transport |
| `SPC-OVR` | oos-verdict-rule | `smith-design.md` §Interfaces §`OOS` verdict rule |

## PRM — プロンプト執筆（24 項目）

| ID | 名前 | 出典 |
|---|---|---|
| `PRM-IV`  | instruction-voice | `concepts.md` + `components.md` — canonical here |
| `PRM-CPM` | critical-phase-markers | `concepts.md` §Design Principles |
| `PRM-OSD` | output-shape-directives | `concepts.md` §Design Principles |
| `PRM-SC`  | scope-constraint | `concepts.md` §Design Principles |
| `PRM-SMC` | single-message-completion | `components.md` §Commands |
| `PRM-SBS` | skill-body-style | `components.md` §Skills |
| `PRM-FPE` | false-positive-enumeration | `patterns.md` §Quality Control |
| `PRM-OFD` | output-format-discipline | `patterns.md` §Quality Control |
| `PRM-CD`  | code-delegation | `patterns.md` §Advanced Patterns |
| `PRM-LFD` | lean-forward-description | `components.md` §Skills §Front matter (lean-forward bullet) |
| `PRM-APE` | anti-pattern-enumeration | `components.md` §Agents §Representative specialized agents |
| `PRM-CWF` | context-window-frugality | `checklists.md` §Prompt §1 Conciseness |
| `PRM-IS`  | instruction-specificity | `checklists.md` §Prompt §2 Specificity |
| `PRM-PIF` | positive-instruction-form | `checklists.md` §Prompt §3 Positive form |
| `PRM-IR`  | instruction-rationale | `checklists.md` §Prompt §4 Motivation |
| `PRM-IFL` | instruction-freedom-level | `checklists.md` §Prompt §5 Degree of freedom |
| `PRM-VSC` | verifiable-success-criteria | `checklists.md` §Prompt §6 Verification |
| `PRM-MSS` | multi-step-structuring | `checklists.md` §Prompt §7 Workflow structure |
| `PRM-TC`  | terminology-consistency | `checklists.md` §Prompt §8 Terminology |
| `PRM-TIC` | time-independent-content | `checklists.md` §Skill §3 Content |
| `PRM-DPE` | default-plus-escape | `checklists.md` §Skill §3 Content |
| `PRM-SAC` | single-approach-commitment | `case-studies.md` §feature-dev §Agent design notes (code-architect) |
| `PRM-NRP` | null-result-protocol | `case-studies.md` §feature-dev §Agent design notes (code-reviewer) |
| `PRM-NT`  | necessity-test | `checklists.md` §CLAUDE.md §2 Conciseness |

## FLW — フロー（29 項目）

**TODO**: FLW（29 項目、27%）について、改善パイプラインのクラスタが拡張するにつれてサブセクションのさらなる細分化が必要かを決める。

### ディスパッチと制御フロー

| ID | 名前 | 出典 |
|---|---|---|
| `FLW-EAG` | explicit-approval-gate | `concepts.md` §Design Principles |
| `FLW-LEB` | loop-escape-ban | `concepts.md` §Design Principles |
| `FLW-MTS` | model-tier-selection | `concepts.md` §Design Principles |
| `FLW-PVS` | parallel-vs-sequential | `concepts.md` §Design Principles |
| `FLW-PC`  | phase-control | `components.md` §Commands |
| `FLW-MTP` | model-tier-pipeline | `components.md` §Agents |
| `FLW-PPS` | parallel-perspective-split | `components.md` §Agents |
| `FLW-RES` | reporter-evaluator-separation | `components.md` + `patterns.md` — canonical here |
| `FLW-SD`  | selective-dispatch | `case-studies.md` §pr-review-toolkit §Selective dispatch |
| `FLW-SDP` | signal-driven-proposal | `case-studies.md` §claude-code-setup §Recommendation framework |
| `FLW-PCP` | parallel-candidate-presentation | `README.md` §Usage §Create step 3 |
| `FLW-WVA` | whole-view-agent | `smith-design.md` §Architecture §Rationale bullet 5 |
| `FLW-DOW` | dependency-ordered-writes | `smith-design.md` §Dependency ordering |

### 品質ゲート

| ID | 名前 | 出典 |
|---|---|---|
| `FLW-CTF` | confidence-threshold-filter | `patterns.md` §Quality Control |
| `FLW-DEC` | double-eligibility-check | `patterns.md` §Quality Control + §Advanced Patterns — canonical here |
| `FLW-BAC` | blind-ab-comparison | `patterns.md` §Advanced Patterns |
| `FLW-STM` | severity-tier-model | `checklists.md` §How to Use §Severity tiers |
| `FLW-AST` | automation-stance-tagging | `checklists.md` §How to Use §Automation stance |
| `FLW-FSB` | finding-severity-bins | `README.md` §Usage §Improve (invocation table) |
| `FLW-WQR` | weighted-quality-rubric | `case-studies.md` §claude-md-management §A–F grading |

### 改善パイプライン

| ID | 名前 | 出典 |
|---|---|---|
| `FLW-PSC` | post-session-capture | `case-studies.md` §claude-md-management §`revise-claude-md` |
| `FLW-PVE` | plan-validate-execute | `checklists.md` §Skill §5 Code and scripts |
| `FLW-SDD` | symptom-driven-diagnosis | `README.md` §Usage §Improve (path + problem variant) |
| `FLW-EPA` | evaluate-propose-apply | `smith-design.md` §Flow (steps 3–9 overall shape) |
| `FLW-PIV` | pre-image-verification | `smith-design.md` §Flow step 8 |
| `FLW-REA` | reconcile-expected-actual | `smith-design.md` §Flow step 9 |

### スコアリングとランキング

| ID | 名前 | 出典 |
|---|---|---|
| `FLW-CSF` | convergence-scoring-formula | `smith-design.md` §Interfaces §Convergence score formula |
| `FLW-EER` | expected-effect-ranking | `smith-design.md` §Interfaces §Ranking formula |
| `FLW-DSAS` | deterministic-steps-as-scripts | `smith-design.md` §Architecture §Rationale bullet 3 |

## CTX — コンテキストと状態（12 項目）

| ID | 名前 | 出典 |
|---|---|---|
| `CTX-PD`  | progressive-disclosure | `concepts.md` §Core Design Patterns |
| `CTX-LMS` | local-md-state-file | `patterns.md` §State Management |
| `CTX-TWA` | todo-write-anchor | `patterns.md` §State Management |
| `CTX-FFL` | filesystem-feedback-loop | `components.md` + `patterns.md` — canonical here |
| `CTX-CM`  | conversation-mining | `patterns.md` §Advanced Patterns |
| `CTX-RRR` | runtime-rule-reload | `case-studies.md` §hookify §Immediate reflection |
| `CTX-CS`  | context-separation | `checklists.md` §Skill §2 Progressive disclosure |
| `CTX-SST` | session-snapshot-timing | `checklists.md` §Hook §5 Execution |
| `CTX-CIR` | claude-md-inclusion-rules | `checklists.md` §CLAUDE.md §1 Content inclusion |
| `CTX-RHM` | rule-hook-migration | `checklists.md` §CLAUDE.md §3 Instruction effectiveness |
| `CTX-CMP` | claude-md-placement | `checklists.md` §CLAUDE.md §4 Placement |
| `CTX-SDW` | skill-doc-wrapping | `README.md` §Architecture §Skills |

## 重複の解消

6 つの項目が複数の出典に登場する。正規 ID は上記に列挙されている単一のエントリで、その他の出現箇所はクロスリファレンスとなる。

| 正規 ID | 名前 | 集約された重複出典 |
|---|---|---|
| `SPC-STR` | skill-three-roles | `concepts.md` §Three roles of SKILL.md, `components.md` §Three roles a SKILL.md can play |
| `SPC-PTL` | pretool-two-layer | `components.md` §Representative hook patterns (PreToolUse bullet), `patterns.md` §Fixed patterns vs dynamic rules |
| `PRM-IV`  | instruction-voice | `concepts.md` §Prompts are instructions to Claude, `components.md` §Write commands as instructions |
| `FLW-RES` | reporter-evaluator-separation | `components.md` §Separation of reporter and evaluator, `patterns.md` §Separation of reporter and evaluator |
| `FLW-DEC` | double-eligibility-check | `patterns.md` §Double eligibility check, `patterns.md` §Double eligibility in long-running reviews |
| `CTX-FFL` | filesystem-feedback-loop | `components.md` §Representative hook patterns (Stop-based loop bullet), `patterns.md` §Self-referential loop |

## taxonomy から除外

検討の上、今回のパスから意図的に除外した項目。

| 項目 | 理由 |
|---|---|
| `hook-rule-schema` — hookify の `name/enabled/event/pattern/action` ルールファイル形式 | 単一プラグインの規約。まだ汎用化可能ではない。**TODO**: 2 つ目のプラグインが同じスキーマを採用したら再検討する。 |
| `feature-vs-component-scope` — smith のフィーチャー対コンポーネントの 2 層モデル | 改善系プラグインに固有。汎用 taxonomy には狭すぎる。`../README.md` §What smith does に文書化済み。 |
| `concepts.md` §Component inventory table（17 プラグイン） | 参照データ。執筆ノウハウではない。 |
| `components.md` §Representative specialized agents（箇条書き） | `SPC-AFM`, `FLW-PPS`, `FLW-MTP` の例示。独立した項目ではない。 |

## 合計

| ドメイン | 項目数 | 比率 |
|---|---|---|
| ARC | 10 | 9% |
| SPC | 32 | 30% |
| PRM | 24 | 22% |
| FLW | 29 | 27% |
| CTX | 12 | 11% |
| **合計** | **107** | — |

Stage 2 の合計（concepts + components + patterns のみ）：49 項目。
Stage 3 の追加（case-studies + checklists + README + smith-design）：+58 項目。
集約された重複：6（Stage 2 から変更なし）。重複排除前の生のカウント：113。

