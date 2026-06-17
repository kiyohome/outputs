# chee-portfolio — Design Specification

> **Governing rule:** This file takes precedence over `input/figma-to-wp-guideline.md`.  
> Keep this file in sync with the implementation. Update it when decisions change.

## Goal

> **Deploy to production exactly what was verified under production-equivalent conditions.**

---

## Environment

| Environment | Purpose | Data |
|-------------|---------|------|
| Local (Docker) | Development | Fixtures / dummy data |
| Staging | Verification | **Production copy (refreshed before each release)** |
| Production | Live | Authoritative |

---

## Git Scope

### Tracked

- `theme/` — WordPress block theme (all source)
- `input/` — Design source files (read-only reference)
- Build config, `design.md`, `steering.md`

### Not tracked

- `wp-dev/` — WP core, SQLite DB, uploads (gitignored)
- Production / staging DB and uploads

---

## Release Flow

```
1. Develop on feature branch (Git)
2. prod → stg  copy  (DB + uploads, just before release)
3. Git → stg   deploy  (theme code)
4. Verify on stg  (real data, Playwright E2E)
5. Git → prod  deploy  (same commit as step 3)
```

**Invariant:** The commit deployed to staging in step 3 is the exact commit promoted to production in step 5.

---

## CI/CD — GitHub Actions

Single pipeline, triggered on merge to `main`:

```
Job 1: sync-stg
  - rsync prod DB → stg  (ssh -p 10022)
  - rsync prod uploads → stg

Job 2: deploy-stg  (needs: sync-stg)
  - rsync theme/ → stg document root

Job 3: e2e  (needs: deploy-stg)
  - Playwright against stg URL
  - Assertions: see E2E section below

Job 4: deploy-prod  (needs: e2e)
  - rsync theme/ → prod document root  (same ref as deploy-stg)
```

### Deploy command (both stg and prod)

```bash
rsync -avz --delete \
  -e "ssh -p 10022" \
  theme/ \
  {user}@{host}:/home/{server_id}/{domain}/public_html/wp-content/themes/chee-portfolio/
```

### Xserver facts (confirmed)

| Item | Value |
|------|-------|
| SSH port | 10022 |
| Auth | Public-key only |
| Document root | `/home/{server_id}/{domain}/public_html/` |
| WP-CLI | Not pre-installed; manual install to `~/bin/` |
| DB copy | `wp db export` / `wp db import` over SSH |

Placeholders `{server_id}`, `{domain}` are stored as GitHub Secrets.

---

## E2E — Playwright

**When:** Job 3 in the pipeline, against staging URL with production data.

**Scope:**

| Check | Assertion |
|-------|-----------|
| Home renders | `h1` visible, no PHP error output |
| Works archive | At least 1 Works card visible |
| Works single | CPT fields (client name, mockup image) present |
| Contact form | Fluent Forms shortcode renders an `<input>` |
| Navigation | Header links present on all 3 page types |
| No 404 assets | No `<img>` with broken src on home page |

**Tool:** Playwright (TypeScript). Tests live in `theme/e2e/`.

---

## WordPress Architecture

### Theme structure

```
theme/
├── style.css
├── theme.json
├── index.php
├── functions.php
├── templates/
│   ├── front-page.html
│   ├── archive-works.html
│   └── single-works.html
├── parts/
│   ├── header.html
│   └── footer.html
├── patterns/
│   ├── sec01-fv.php
│   ├── sec02-works.php
│   ├── sec03-voice.php
│   ├── sec04-service.php
│   ├── sec05-cta.php
│   ├── sec06-profile.php
│   ├── sec07-flow.php
│   └── sec08-contact.php
├── assets/
│   ├── fonts/        (WOFF2, self-hosted)
│   ├── images/       (copied from input/)
│   └── js/
│       ├── splide-init.js
│       └── vendor/   (Splide v4 + Auto Scroll, self-hosted)
└── e2e/              (Playwright tests)
```

### Plugins

| Plugin | Replaces (guideline) | Reason |
|--------|----------------------|--------|
| **Pods + Meta Field Block** | ACF Free | Pods covers CPT + taxonomy + fields, fully free; Meta Field Block displays custom fields inside Query Loop without extra plugin |
| **Fluent Forms** | Contact Form 7 | CF7 entered feature-freeze 2026; Fluent Forms free tier includes Ajax, conditional logic, privacy checkbox |
| Splide.js v4 (self-hosted) | — | FV auto-scroll, Voice carousel, single-works gallery |

### Page Hierarchy & Transitions

```
トップ (front-page)
├── sec01 FV カルーセル
│   └── 各スライド（Works mockup_image） → クリック → 制作詳細 (single-works)
├── sec02 制作実績（フィールドで選択した2件、thumbnail表示）
│   ├── 各カード → クリック → 制作詳細 (single-works)
│   └── "制作実績の一覧へ" ボタン → 制作一覧 (archive-works)
├── ヘッダーナビ — 全項目がトップページ内アンカー（/#works, /#voice 等）
│   └── "Works" → /#works（トップ sec02 へスクロール、/works/ ではない）
└── フッターナビ "制作実績" → /works/（制作一覧ページ）

制作一覧 (archive-works) — パンくず + 全件カード（category_label + client_name + thumbnail） + 下部CTA
└── 各カード → クリック → 制作詳細 (single-works)

制作詳細 (single-works) — パンくず + title + meta + post_content + 下部CTA
```

### Works CPT

| Setting | Value |
|---------|-------|
| Slug | `works` |
| Archive | `/works/` |
| REST API | `true` (required for Query Loop) |

**画像の使われ方（セクション別）:**

| セクション | 使用画像フィールド | 表示件数 | 遷移先 |
|---|---|---|---|
| sec01 FV カルーセル | `mockup_image` | フィールドで指定した件数 | 制作詳細 |
| sec02 トップ制作実績 | `thumbnail` | フィールドで指定した2件 | 制作詳細 |
| archive-works 制作一覧 | `thumbnail` | 全件 | 制作詳細 |
| single-works 制作詳細 | `thumbnail` | — | — |

**Taxonomy: `works-category`**

Initial values (can be added/removed from WP admin later):

| Label | Slug |
|-------|------|
| ディレクション | direction |
| 広告バナー | ad-banner |
| 広告運用 | ad-operation |
| LPデザイン | lp-design |
| HPデザイン | hp-design |
| LP制作 | lp |
| HP制作 | hp |

**Pods custom fields:**

| Field | Type | Use |
|-------|------|-----|
| client_name | Text | クライアント名（一覧カード） |
| category_label | Text | 自由記述ラベル（例: "眉毛アートメイク"）（一覧カード） |
| thumbnail | Image | トップsec02・制作一覧のサムネイル |
| mockup_image | Image | スマホモックアップ — FVカルーセル専用 |
| fv_featured | Checkbox | FVカルーセルに表示するか（1=表示） |
| fv_order | Number | FVカルーセルの並び順（昇順） |
| top_show | Number | トップsec02の表示位置（0=非表示, 1=1枚目, 2=2枚目） |
| list_order | Number | 制作一覧の並び順（昇順） |

詳細ページの本文（目的・担当範囲・制作期間・ポイント・ツール・制作物画像）はすべてブロックエディタ（`post_content`）で入力する。

### Voice CPT

| Setting | Value |
|---------|-------|
| Slug | `voice` |
| Archive | disabled |
| REST API | `true` |

**Pods custom fields:**

| Field | Type | Use |
|-------|------|-----|
| voice_photo | Image | Profile photo (displayed as circle) |
| voice_role | Text | e.g., "セールスライター" |
| voice_name | Text | e.g., "Tさん" |
| voice_body | Textarea | Testimonial text |
| voice_catchphrase | Text | Pull-quote headline (hanatotyoutyo font) |

---

## Design Tokens

### Colors (`theme.json` → `settings.color.palette`)

| slug | Value | Use |
|------|-------|-----|
| bg-main | `#DCEFFB` | FV / Voice / Service / Profile backgrounds |
| bg-sub | `#F6F6F6` | Contact background |
| white | `#FFFFFF` | — |
| text-primary | `#111111` | Body text |
| text-secondary | `#333333` | Secondary text |
| accent | `#4EB0EA` | Labels / buttons / links |
| highlight | `#FBFF92` | Highlight |
| border | `#D7D7D7` | Borders |

### Layout

| Setting | Value |
|---------|-------|
| contentSize | `760px` |
| wideSize | `1100px` |
| allowEditing | `false` |

**Layout pattern:** All sections use `align: full` (full-width background) + `layout: constrained` (children at contentSize). `wp:html` blocks use CSS variable `var(--wp--style--global--content-size)` for width.

### Font families

| slug | Family | Weights | Use |
|------|--------|---------|-----|
| noto-sans-jp | Noto Sans JP | 100/400/500/700 | Japanese body |
| roboto-condensed | Roboto Condensed | 300/500 | EN section headings |
| jost | Jost | 400/500 | EN subtext (Futura PT substitute) |
| zen-kurenaido | Zen Kurenaido | 400 | Decorative handwritten |

All fonts self-hosted as WOFF2 under `assets/fonts/`. No external CDN.

### Font sizes (`theme.json` → `settings.typography.fontSizes`)

| slug | Size | fluid min | fluid max |
|------|------|-----------|-----------|
| xs | 14px | — | — |
| sm | 16px | 15px | 16px |
| md | 20px | 18px | 20px |
| lg | 28px | 24px | 28px |
| xl | 36px | 28px | 36px |
| 2xl | 70px | 40px | 70px |
| hero | 128px | 48px | 128px |

---

## Responsive

| Device | Width |
|--------|-------|
| PC | ≥ 1025px |
| Tablet | 782px – 1024px |
| Mobile | ≤ 781px |

Strategy: fluid typography via `clamp()` as default; custom CSS only for navigation breakpoint override (1024px) and FV mockup sizing.

---

## Heading Hierarchy (SEO)

| Level | Use |
|-------|-----|
| h1 | Page title |
| h2 | Section headings (Works / Voice / Service / Profile / Flow / Contact) |
| h3 | Items within sections (case names, service cards, flow steps) |
| h4+ | Not used |

English decorative text ("Works", "Voice", etc.) → Paragraph block with decoration class; `h2` assigned to the Japanese text below it.

---

## Local Dev Environment

```
design-to-code/chee-portfolio/
├── theme/        ← Git-tracked
└── wp-dev/       ← gitignored
    └── (Docker volume: WP core + SQLite or MySQL)
```

**Base image:** `wordpress:php8.2-apache` + `mariadb:10.11`

Docker Compose brings up WP + DB. Theme directory is bind-mounted so edits are live.  
Theme directory is bind-mounted — file saves reflect immediately in the browser at `localhost:8080`.

---

## TODO

Items below require user-provided information and cannot proceed without it.

- [ ] E2E staging URL → add as `STG_URL` in GitHub Secrets
- [ ] `{server_id}`, prod domain, stg domain → add as GitHub Secrets before Task 11
- [ ] WP-CLI status on Xserver (pre-installed or manual `~/bin/` install needed)
- [ ] Playwright mobile viewport (375px) scope — revisit after Task 9 visual check
