# chee-portfolio

WordPress FSE (Full Site Editing) block theme for Chee Design portfolio site.

## Requirements

| Tool | Version |
|------|---------|
| Colima | latest |
| Docker | latest |
| docker-compose | v2 |
| WP-CLI | bundled in `cli` container |

## Quick Start

### 1. Start Colima + containers

```bash
colima start
cd wp-dev
docker compose up -d
```

### 2. Install WordPress core

```bash
docker compose run --rm cli wp core install \
  --url=http://localhost:8080 \
  --title="Chee Portfolio" \
  --admin_user=admin \
  --admin_password=admin \
  --admin_email=admin@example.com \
  --allow-root
```

### 3. Activate the theme

```bash
docker compose run --rm cli wp theme activate chee-portfolio --allow-root
```

### 4. Install and activate plugins

```bash
docker compose run --rm cli wp plugin install pods meta-field-block fluentform --activate --allow-root
```

### 5. Open in browser

- Site: http://localhost:8080
- Admin: http://localhost:8080/wp-admin (admin / admin)

## Directory Layout

```
chee-portfolio/
├── wp-dev/
│   ├── docker-compose.yml   # MariaDB + WordPress + WP-CLI
│   └── .gitignore
├── theme/                   # Mounted as wp-content/themes/chee-portfolio/
│   ├── style.css
│   ├── theme.json
│   ├── functions.php
│   ├── index.php
│   ├── parts/
│   ├── patterns/
│   ├── templates/
│   ├── assets/
│   │   ├── fonts/
│   │   ├── images/
│   │   └── js/vendor/
│   └── e2e/                 # Playwright tests
└── input/                   # Design source files (read-only)
```

## Stopping and Restarting

```bash
# Stop containers (data preserved in volumes)
docker compose down

# Stop and delete all data
docker compose down -v

# Resume from stopped
colima start
cd wp-dev && docker compose up -d
```

## Theme Development

The `theme/` directory is bind-mounted into the container at runtime. PHP and JSON changes are reflected immediately; no rebuild needed.

## Seed Data (local / staging only)

`seed.sh` populates sample Works and Voice posts for development. **Do not run on production** — enter real content via the admin dashboard instead.

```bash
cd wp-dev
bash seed.sh
```

## Deploy to Production

### 1. Server requirements

| Item | Requirement |
|------|-------------|
| PHP | 8.1 or later |
| MySQL / MariaDB | 5.7 / 10.4 or later |
| WordPress | 6.4 or later |

### 2. Upload the theme

Copy the `theme/` directory to the server's `wp-content/themes/chee-portfolio/`.

Using rsync (replace placeholders):

```bash
rsync -avz --exclude 'e2e/' --exclude 'test-results/' \
  theme/ user@your-server:/path/to/wp-content/themes/chee-portfolio/
```

### 3. Activate the theme and plugins

Log in to **WP Admin > Appearance > Themes** and activate **Chee Portfolio**.

Install and activate the following plugins via **Plugins > Add New**:

| Plugin | Purpose |
|--------|---------|
| Pods | Custom post types (Works, Voice) and custom fields |
| Meta Field Block | Display custom fields in block editor |
| Fluent Forms | Contact form (sec08) |

### 4. Configure WordPress

- **Settings > General**: Set site title, tagline, and URL
- **Settings > Permalinks**: Select **Post name** (`/%postname%/`) and save
- **Settings > Reading**: Set front page to **Your latest posts** (the theme uses `front-page.html`)

### 5. Enter content

Enter all real content through the admin dashboard:

| Content | Location |
|---------|----------|
| Works posts | Posts > Works — title, thumbnail, detail images, category, client name, excerpt, post content |
| Voice posts | Posts > Voice — quote text, photo, star rating |
| Profile photo | Media — upload and replace the placeholder in sec06-profile pattern |
| Contact form | Fluent Forms — set destination email address |

### 6. Verify

Open the site in a browser and confirm:

- Front page loads with all 8 sections
- Works archive and detail pages display correctly
- Contact form submits successfully
