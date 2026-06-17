<?php
/**
 * Title: Single Works — 制作詳細カードヘッダー
 * Slug: chee-portfolio/single-works-content
 * Categories: chee-portfolio
 * Block Types: core/group
 */

$post_id   = get_the_ID();
$cat_label = get_post_meta($post_id, 'category_label', true);
$client    = get_post_meta($post_id, 'client_name', true);
$img_id    = get_post_meta($post_id, 'thumbnail', true);
$img_url   = $img_id ? wp_get_attachment_image_url((int) $img_id, 'large') : '';
$terms     = get_the_terms($post_id, 'works-category');
$excerpt   = has_excerpt() ? get_the_excerpt() : wp_trim_words(get_the_content(), 80, '…');
?>
<!-- wp:html -->
<div class="single-works-card">
  <div class="single-works-card__header">
    <div class="single-works-card__title-row">
      <span class="single-works-card__label">
        <?php if ($cat_label): ?>[<?php echo esc_html($cat_label); ?>]<?php endif; ?>
      </span>
      <span class="single-works-card__client"><?php echo esc_html($client); ?></span>
      <svg class="single-works-card__arrow" viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="11" stroke="#4EB0EA" stroke-width="1.5"/><path d="M10 12h5m-2-2 2 2-2 2" stroke="#4EB0EA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <hr class="single-works-card__line">
    <?php if ($terms && ! is_wp_error($terms)): ?>
    <div class="single-works-card__pills">
      <?php foreach ($terms as $term): ?>
      <span class="work-pill"><?php echo esc_html($term->name); ?></span>
      <?php endforeach; ?>
    </div>
    <?php endif; ?>
    <?php if ($excerpt): ?>
    <p class="single-works-card__desc"><?php echo esc_html($excerpt); ?></p>
    <?php endif; ?>
  </div>
  <?php if ($img_url): ?>
  <div class="single-works-card__thumbnail">
    <img src="<?php echo esc_url($img_url); ?>" alt="<?php echo esc_attr(get_the_title()); ?>" loading="lazy">
  </div>
  <?php endif; ?>
</div>
<!-- /wp:html -->
