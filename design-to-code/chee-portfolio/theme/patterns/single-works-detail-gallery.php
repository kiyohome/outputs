<?php
/**
 * Title: Single Works — 詳細画像ギャラリー
 * Slug: chee-portfolio/single-works-detail-gallery
 * Categories: chee-portfolio
 * Block Types: core/group
 */

$ids_str = get_post_meta(get_the_ID(), 'detail_images', true);
if (!$ids_str) return;
$ids = array_filter(array_map('intval', explode(',', $ids_str)));
if (empty($ids)) return;
?>
<!-- wp:html -->
<div class="works-detail-gallery">
  <?php foreach ($ids as $id): ?>
  <img
    src="<?php echo esc_url(wp_get_attachment_image_url($id, 'large')); ?>"
    alt="<?php echo esc_attr(get_the_title()); ?>"
    loading="lazy"
  >
  <?php endforeach; ?>
</div>
<!-- /wp:html -->
