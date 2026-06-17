<?php
/**
 * Title: Service — サービス
 * Slug: chee-portfolio/sec04-service
 * Categories: chee-portfolio
 * Block Types: core/group
 */
?>
<!-- wp:group {"tagName":"section","align":"full","className":"sec-service","style":{"spacing":{"padding":{"top":"80px","bottom":"80px"}}},"layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull sec-service" style="padding-top:80px;padding-bottom:80px" id="service">

<!-- wp:heading {"level":2,"className":"sec-title","textAlign":"center","style":{"typography":{"fontStyle":"normal","fontWeight":"500"}},"fontFamily":"roboto-condensed","fontSize":"xl","textColor":"text-primary"} -->
<h2 class="wp-block-heading sec-title has-text-align-center has-roboto-condensed-font-family has-xl-font-size has-text-primary-color has-text-color" style="font-style:normal;font-weight:500">Service</h2>
<!-- /wp:heading -->

<!-- wp:group {"backgroundColor":"bg-main","style":{"border":{"radius":"40px"},"spacing":{"padding":{"top":"48px","bottom":"48px","left":"32px","right":"32px"},"blockGap":"24px"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group has-bg-main-background-color has-background" style="border-radius:40px;padding-top:48px;padding-right:32px;padding-bottom:48px;padding-left:32px">

<!-- wp:group {"style":{"border":{"radius":"8px"},"spacing":{"padding":{"top":"24px","bottom":"24px","left":"24px","right":"24px"}}},"backgroundColor":"white","layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->
<div class="wp-block-group has-white-background-color has-background" style="border-radius:8px;padding-top:24px;padding-right:24px;padding-bottom:24px;padding-left:24px">
<!-- wp:group {"className":"service-card-left","layout":{"type":"flex","orientation":"vertical","flexWrap":"nowrap"}} -->
<div class="wp-block-group service-card-left">
<!-- wp:group {"className":"service-label","style":{"border":{"radius":"4px"},"spacing":{"padding":{"top":"5px","bottom":"5px","left":"10px","right":"10px"}}},"backgroundColor":"accent","layout":{"type":"constrained"}} -->
<div class="wp-block-group service-label has-accent-background-color has-background" style="border-radius:4px;padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:10px">
<!-- wp:paragraph {"textColor":"white","style":{"typography":{"fontWeight":"700"}},"fontSize":"sm"} --><p class="has-white-color has-text-color has-sm-font-size" style="font-weight:700">ディレクション</p><!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:image {"url":"<?php echo esc_url(get_template_directory_uri() . '/assets/images/plan.webp'); ?>","alt":"ディレクション","style":{"layout":{"selfStretch":"fixed","flexSize":"64px"}}} -->
<figure class="wp-block-image"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/plan.webp'); ?>" alt="ディレクション"/></figure>
<!-- /wp:image -->
</div>
<!-- /wp:group -->
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
<!-- wp:paragraph {"fontSize":"sm","textColor":"text-primary"} -->
<p class="has-sm-font-size has-text-primary-color has-text-color">お客様のお困りごとを解決するための、対応を整理していきます。ユーザーがクリックするまでの感情の流れに沿って、LP（ランディングページ）の設計と構成を行います。各業務担当者とも連携し、品質チェックを行い納品致します。</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"border":{"radius":"8px"},"spacing":{"padding":{"top":"24px","bottom":"24px","left":"24px","right":"24px"}}},"backgroundColor":"white","layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->
<div class="wp-block-group has-white-background-color has-background" style="border-radius:8px;padding-top:24px;padding-right:24px;padding-bottom:24px;padding-left:24px">
<!-- wp:group {"className":"service-card-left","layout":{"type":"flex","orientation":"vertical","flexWrap":"nowrap"}} -->
<div class="wp-block-group service-card-left">
<!-- wp:group {"className":"service-label","style":{"border":{"radius":"4px"},"spacing":{"padding":{"top":"5px","bottom":"5px","left":"10px","right":"10px"}}},"backgroundColor":"accent","layout":{"type":"constrained"}} -->
<div class="wp-block-group service-label has-accent-background-color has-background" style="border-radius:4px;padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:10px">
<!-- wp:paragraph {"textColor":"white","style":{"typography":{"fontWeight":"700"}},"fontSize":"sm"} --><p class="has-white-color has-text-color has-sm-font-size" style="font-weight:700">LP制作</p><!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:image {"url":"<?php echo esc_url(get_template_directory_uri() . '/assets/images/do.webp'); ?>","alt":"LP制作"} -->
<figure class="wp-block-image"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/do.webp'); ?>" alt="LP制作"/></figure>
<!-- /wp:image -->
</div>
<!-- /wp:group -->
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
<!-- wp:paragraph {"fontSize":"sm","textColor":"text-primary"} -->
<p class="has-sm-font-size has-text-primary-color has-text-color">広告運用の経験を活かし、伝わる・クリックされる "反応率"を意識したデザインを提供します。LPデザイン、広告バナー、各種画像制作。</p>
<!-- /wp:paragraph -->
<!-- wp:html -->
<div class="service-tools">
  <span class="service-tools-label">利用ツール</span>
  <span class="tool-badge tool-figma" title="Figma">
    <svg viewBox="0 0 28 28" width="28" height="28"><rect width="28" height="28" rx="6" fill="#1E1E1E"/><circle cx="10" cy="10" r="4" fill="#F24E1E"/><circle cx="18" cy="10" r="4" fill="#FF7262"/><circle cx="10" cy="18" r="4" fill="#0ACF83"/><circle cx="18" cy="18" r="4" fill="#A259FF"/></svg>
  </span>
  <span class="tool-badge tool-ps" title="Photoshop">
    <svg viewBox="0 0 28 28" width="28" height="28"><rect width="28" height="28" rx="6" fill="#001E36"/><text x="50%" y="68%" text-anchor="middle" fill="#31A8FF" font-size="12" font-weight="700" font-family="Arial,sans-serif">Ps</text></svg>
  </span>
  <span class="tool-badge tool-ai" title="Illustrator">
    <svg viewBox="0 0 28 28" width="28" height="28"><rect width="28" height="28" rx="6" fill="#330000"/><text x="50%" y="68%" text-anchor="middle" fill="#FF9A00" font-size="12" font-weight="700" font-family="Arial,sans-serif">Ai</text></svg>
  </span>
  <span class="tool-badge tool-wp" title="WordPress">
    <svg viewBox="0 0 28 28" width="28" height="28"><circle cx="14" cy="14" r="13" fill="#21759B"/><text x="50%" y="68%" text-anchor="middle" fill="#fff" font-size="14" font-weight="900" font-family="Georgia,serif">W</text></svg>
  </span>
  <span class="tool-badge tool-studio" title="Studio">/Studio</span>
</div>
<!-- /wp:html -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"border":{"radius":"8px"},"spacing":{"padding":{"top":"24px","bottom":"24px","left":"24px","right":"24px"}}},"backgroundColor":"white","layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->
<div class="wp-block-group has-white-background-color has-background" style="border-radius:8px;padding-top:24px;padding-right:24px;padding-bottom:24px;padding-left:24px">
<!-- wp:group {"className":"service-card-left","layout":{"type":"flex","orientation":"vertical","flexWrap":"nowrap"}} -->
<div class="wp-block-group service-card-left">
<!-- wp:group {"className":"service-label","style":{"border":{"radius":"4px"},"spacing":{"padding":{"top":"5px","bottom":"5px","left":"10px","right":"10px"}}},"backgroundColor":"accent","layout":{"type":"constrained"}} -->
<div class="wp-block-group service-label has-accent-background-color has-background" style="border-radius:4px;padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:10px">
<!-- wp:paragraph {"textColor":"white","style":{"typography":{"fontWeight":"700"}},"fontSize":"sm"} --><p class="has-white-color has-text-color has-sm-font-size" style="font-weight:700">広告運用</p><!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:image {"url":"<?php echo esc_url(get_template_directory_uri() . '/assets/images/action.webp'); ?>","alt":"広告運用"} -->
<figure class="wp-block-image"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/action.webp'); ?>" alt="広告運用"/></figure>
<!-- /wp:image -->
</div>
<!-- /wp:group -->
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
<!-- wp:paragraph {"fontSize":"sm","textColor":"text-primary"} -->
<p class="has-sm-font-size has-text-primary-color has-text-color">LPデザイン・広告バナー制作から設定・運用まで一貫して担当するため、データを見ながらすぐに修正・改善に動けます。複数の業者に分けて依頼するより、コストとスピードの両面でメリットがあります。</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->

</section>
<!-- /wp:group -->
