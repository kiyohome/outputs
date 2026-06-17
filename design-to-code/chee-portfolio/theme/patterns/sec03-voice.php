<?php
/**
 * Title: Voice — お客様の声
 * Slug: chee-portfolio/sec03-voice
 * Categories: chee-portfolio
 * Block Types: core/group
 */
?>
<!-- wp:group {"tagName":"section","align":"full","className":"sec-voice","backgroundColor":"bg-main","style":{"spacing":{"padding":{"top":"80px","bottom":"80px"}}},"layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull sec-voice has-bg-main-background-color has-background" style="padding-top:80px;padding-bottom:80px" id="voice">

<!-- wp:heading {"level":2,"className":"sec-title","textAlign":"center","style":{"typography":{"fontStyle":"normal","fontWeight":"500"}},"fontFamily":"roboto-condensed","fontSize":"xl","textColor":"text-primary"} -->
<h2 class="wp-block-heading sec-title has-text-align-center has-roboto-condensed-font-family has-xl-font-size has-text-primary-color has-text-color" style="font-style:normal;font-weight:500">Voice</h2>
<!-- /wp:heading -->

<!-- wp:html -->
<div class="splide voice-splide" aria-label="お客様の声">
  <div class="splide__track">
    <ul class="splide__list">
      <?php
      $voices = get_posts(['post_type' => 'voice', 'posts_per_page' => -1, 'orderby' => 'date', 'order' => 'DESC']);
      $i = 1;
      foreach ($voices as $voice) {
        $photo_id    = get_post_meta($voice->ID, 'voice_photo', true);
        $photo_url   = $photo_id ? wp_get_attachment_image_url((int) $photo_id, 'thumbnail') : '';
        $role        = get_post_meta($voice->ID, 'voice_role', true);
        $name        = get_post_meta($voice->ID, 'voice_name', true);
        $body        = get_post_meta($voice->ID, 'voice_body', true);
        $catchphrase = get_post_meta($voice->ID, 'voice_catchphrase', true);
        echo '<li class="splide__slide">';
        echo '<div class="voice-card">';
        echo '<div class="voice-card__left">';
        echo '<span class="voice-card__num">' . sprintf('%02d', $i) . '</span>';
        echo '<span class="voice-card__num-label">voice</span>';
        if ($photo_url) {
          echo '<img class="voice-card__photo" src="' . esc_url($photo_url) . '" alt="' . esc_attr($name) . '" loading="lazy">';
        } else {
          echo '<div class="voice-card__photo voice-card__photo--placeholder" aria-hidden="true"></div>';
        }
        if ($role) echo '<p class="voice-card__role">' . esc_html($role) . '</p>';
        if ($name) echo '<p class="voice-card__name">' . esc_html($name) . '</p>';
        echo '</div>';
        echo '<div class="voice-card__right">';
        if ($catchphrase) echo '<p class="voice-card__catchphrase">' . esc_html($catchphrase) . '</p>';
        if ($body) echo '<div class="voice-card__body">' . nl2br(esc_html($body)) . '</div>';
        echo '</div>';
        echo '</div>';
        echo '</li>';
        $i++;
      }
      ?>
    </ul>
  </div>
</div>
<!-- /wp:html -->

</section>
<!-- /wp:group -->
