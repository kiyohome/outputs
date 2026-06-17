<?php
/**
 * Title: Archive Works — 制作実績一覧コンテンツ
 * Slug: chee-portfolio/archive-works-content
 * Categories: chee-portfolio
 * Block Types: core/group
 */
?>
<!-- wp:html -->
<?php
$works = get_posts([
  'post_type'      => 'works',
  'posts_per_page' => 6,
  'orderby'        => 'date',
  'order'          => 'DESC',
]);
?>
<div class="works-list">
<?php foreach ($works as $work):
  $cat_label = get_post_meta($work->ID, 'category_label', true);
  $client    = get_post_meta($work->ID, 'client_name', true);
  $img_id    = get_post_meta($work->ID, 'thumbnail', true);
  $img_url   = $img_id ? wp_get_attachment_image_url((int) $img_id, 'large') : '';
  $terms     = get_the_terms($work->ID, 'works-category');
  $excerpt   = has_excerpt($work->ID) ? get_the_excerpt($work->ID) : wp_trim_words($work->post_content, 60, '…');
?>
<div class="work-card">
  <div class="work-card-body">
    <div class="work-card-header">
      <h3 class="work-card-title">
        <a href="<?php echo get_permalink($work->ID); ?>">
          <?php if ($cat_label): ?><span class="work-card-catlabel">[<?php echo esc_html($cat_label); ?>]</span><?php endif; ?>
          <?php echo esc_html($client ?: $work->post_title); ?>
        </a>
        <a href="<?php echo get_permalink($work->ID); ?>" class="work-card-arrow-link" aria-label="<?php echo esc_attr($work->post_title); ?>の詳細">
          <svg class="work-card-arrow" viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="11" stroke="#4EB0EA" stroke-width="1.5"/><path d="M10 12h5m-2-2 2 2-2 2" stroke="#4EB0EA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </h3>
    </div>
    <?php if ($terms && ! is_wp_error($terms)): ?>
    <div class="work-card-pills">
      <?php foreach ($terms as $term): ?>
      <span class="work-pill"><?php echo esc_html($term->name); ?></span>
      <?php endforeach; ?>
    </div>
    <?php endif; ?>
    <?php if ($excerpt): ?>
    <p class="work-card-desc"><?php echo esc_html($excerpt); ?></p>
    <?php endif; ?>
  </div>
  <?php if ($img_url): ?>
  <div class="work-card-image">
    <a href="<?php echo get_permalink($work->ID); ?>">
      <img src="<?php echo esc_url($img_url); ?>" alt="<?php echo esc_attr($work->post_title); ?>" loading="lazy">
    </a>
  </div>
  <?php endif; ?>
</div>
<?php endforeach; ?>
</div>

<div class="page-cta">
  <a href="/#contact" class="page-cta__link">ご相談・お問合せはこちら</a>
</div>
<!-- /wp:html -->
