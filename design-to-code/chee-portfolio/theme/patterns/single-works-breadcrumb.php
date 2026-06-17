<?php
/**
 * Title: Breadcrumb — 制作詳細
 * Slug: chee-portfolio/single-works-breadcrumb
 * Categories: chee-portfolio
 * Block Types: core/group
 */
?>
<!-- wp:html -->
<nav class="breadcrumb" aria-label="パンくずリスト">
  <a href="/">HOME</a><span class="breadcrumb__sep">&gt;</span><a href="/works/">制作実績一覧</a><span class="breadcrumb__sep">&gt;</span><span class="breadcrumb__current"><?php echo esc_html(get_the_title()); ?></span>
</nav>
<!-- /wp:html -->
