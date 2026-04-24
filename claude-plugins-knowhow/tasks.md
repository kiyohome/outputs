# Tasks

## Original intent

First message (Japanese, preserved verbatim):

> plugin-smith
> aiya-jam
> の順に作成を進めたい。
> すべてaiyaのモノレポで開発、ただしこの2つはモノレポのパッケージ開発でも使いながら改善するので、モノレポの.claudeに配置します。
> イメージできますか？
> smith作って、smith使ってjamを作る

Subsequent intent for this work-stream, verbatim:

> claude pluginのノウハウ、ノウハウに分かりやすく覚えやすい名前を付けて、チェック項目を扱いやすくしたい。

User's explicit 2-step plan, verbatim:

> **１** taxonomyにノウハウ集めてるんですよね？チェックリストやケーススタディなど、すべてのドキュメントを精査してtaxonomyに具体的なノウハウとして集めましょう
>
> **２** １でノウハウが固まるので、あとはチェックリストがあればよいですよね。ノウハウからチェックリストを作成しましょう、チェックリストにはチェック方法、改善方法、改善例など、smithの実行を想定して必要な項目を定義してから進めましょう。

## Active tasks

### Step 2 — Generate checklists from taxonomy

Goal: produce a structured per-ID checklist that the `smith-knowhow` skill can load at runtime.

- **2.0** Agree on the output format. Proposed schema (`id` / `severity` / `auto` / `check` / `fix` / `example`) and filename (`docs/checklist-items.md` as a new file, or an extension of `docs/checklists.md`). Awaiting decision.
- **2.1–2.5** Generate entries domain by domain: ARC (10) → SPC (32) → PRM (24) → FLW (29) → CTX (12). Total 107 items.
- **2.6** Sanity review: ID coverage, severity distribution, `[auto]` machine-verifiability, `fix` actionability.
- **2.7** Retire or re-scope `docs/checklists.md` once `checklist-items.md` is authoritative.

Open decisions (blocking 2.0):

- Single-file vs per-domain split for the Step 2 output.
- Whether to generate all 107 at once or domain by domain.
- Exact schema for the `example` field (inline markdown vs separate file reference).

### Step 3 — Implement smith

- **3.1** Port `docs/checklist-items.md` into the `smith-knowhow` skill at `agents-in-your-area/.claude/plugins/smith/skills/smith-knowhow/`.
- **3.2** Write `/smith` command, three inspector agents, three scripts per `README.md` + `docs/design.md`.
- **3.3** Dogfood smith on `claude-plugins-knowhow/` itself.

## Pivots

- jam removed from smith's scope; Create mode dropped.
- "Consultant" reframed to "craftsperson".
- Knowhow indexing surfaced as a prerequisite to smith implementation.
- The original 49-item extraction was contaminated by domain-classification bias; all 7 source files were re-scanned.
- Design docs restructured: `smith-design.md` retired and split into `README.md` (usage + architecture) + `docs/design.md` (internal data contracts).
- Rule shift: final-artifact-first (`.claude/rules/artifact.md`). Trailing `## TODO` sections are being replaced by inline TODO markers.
