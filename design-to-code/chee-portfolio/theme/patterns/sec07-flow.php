<?php
/**
 * Title: Flow — 制作フロー
 * Slug: chee-portfolio/sec07-flow
 * Categories: chee-portfolio
 * Block Types: core/group
 */
$steps = [
  ['num' => '1', 'title' => '無料ご相談、お問合せ',       'body' => 'お問合せフォーム、あるいは公式LINEやSNSのDMよりお問合せください。'],
  ['num' => '2', 'title' => 'お打ち合わせ、見積もり、ご契約', 'body' => '制作の背景や目的からお伺い致します。'],
  ['num' => '3', 'title' => 'ご提案、設計',              'body' => '競合他社やお客様の目的、ユーザーの利用しやすいサイトを考えます。'],
  ['num' => '4', 'title' => 'デザイン',                  'body' => 'ファーストビュー決定後、全体のデザインを制作いたします。', 'title_lg' => true],
  ['num' => '5', 'title' => 'コーディング、表示確認、調整',  'body' => 'インターネット環境で表示確認をお願いします。'],
  ['num' => '6', 'title' => '納品', 'subtitle' => 'アフターフォロー2週間', 'body' => 'テキストの修正や画像の差し替えなど軽微な修正に対応致します。', 'title_lg' => true],
  ['num' => '7', 'title' => 'ご請求、お支払い',            'body' => '初めてのお取引の場合、着手金として50％お振込みをお願いしております。'],
];
?>
<!-- wp:group {"tagName":"section","align":"full","className":"sec-flow","style":{"spacing":{"padding":{"top":"80px","bottom":"80px"}}},"layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull sec-flow" style="padding-top:80px;padding-bottom:80px" id="flow">

<!-- wp:heading {"level":2,"className":"sec-title","textAlign":"center","style":{"typography":{"fontStyle":"normal","fontWeight":"500"}},"fontFamily":"roboto-condensed","fontSize":"xl","textColor":"text-primary"} -->
<h2 class="wp-block-heading sec-title has-text-align-center has-roboto-condensed-font-family has-xl-font-size has-text-primary-color has-text-color" style="font-style:normal;font-weight:500">Flow</h2>
<!-- /wp:heading -->

<!-- wp:group {"style":{"spacing":{"blockGap":"24px"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
<?php foreach ($steps as $step): ?>
<!-- wp:group {"className":"flow-step","layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->
<div class="wp-block-group flow-step">

<!-- wp:html -->
<div class="flow-step__num"><span class="flow-step__num-text"><?php echo esc_html($step['num']); ?></span></div>
<!-- /wp:html -->

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
<!-- wp:heading {"level":3,"style":{"typography":{"fontStyle":"normal","fontWeight":"500"}},"fontFamily":"noto-sans-jp","fontSize":"sm","textColor":"text-primary"} -->
<h3 class="wp-block-heading has-noto-sans-jp-font-family has-sm-font-size has-text-primary-color has-text-color<?php echo !empty($step['title_lg']) ? ' flow-step__title--lg' : ''; ?>" style="font-style:normal;font-weight:500"><?php echo esc_html($step['title']); ?><?php if (!empty($step['subtitle'])): ?><span class="flow-step__subtitle"><?php echo esc_html($step['subtitle']); ?></span><?php endif; ?></h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"fontSize":"sm","textColor":"text-primary"} -->
<p class="has-sm-font-size has-text-primary-color has-text-color"><?php echo esc_html($step['body']); ?></p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->
<?php endforeach; ?>
</div>
<!-- /wp:group -->

</section>
<!-- /wp:group -->
