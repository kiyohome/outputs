<?php
declare(strict_types=1);

add_action('after_setup_theme', function (): void {
    add_theme_support('wp-block-styles');
});

// ── Styles ──────────────────────────────────────────────────────────────────

add_action('wp_enqueue_scripts', function (): void {
    wp_enqueue_style(
        'chee-portfolio-style',
        get_stylesheet_uri(),
        [],
        wp_get_theme()->get('Version')
    );
    wp_enqueue_script(
        'splide',
        get_template_directory_uri() . '/assets/js/vendor/splide.min.js',
        [],
        '4',
        true
    );
    wp_enqueue_script(
        'splide-auto-scroll',
        get_template_directory_uri() . '/assets/js/vendor/splide-extension-auto-scroll.min.js',
        ['splide'],
        '0.5',
        true
    );
    wp_enqueue_script(
        'chee-splide-init',
        get_template_directory_uri() . '/assets/js/splide-init.js',
        ['splide-auto-scroll'],
        wp_get_theme()->get('Version'),
        true
    );
    wp_enqueue_script(
        'chee-scroll-spy',
        get_template_directory_uri() . '/assets/js/scroll-spy.js',
        [],
        wp_get_theme()->get('Version'),
        true
    );
});

// ── Custom Post Types ────────────────────────────────────────────────────────

add_action('init', function (): void {
    register_post_type('works', [
        'labels' => [
            'name'               => '制作実績',
            'singular_name'      => '制作実績',
            'add_new_item'       => '制作実績を追加',
            'edit_item'          => '制作実績を編集',
            'new_item'           => '新規制作実績',
            'view_item'          => '制作実績を表示',
            'search_items'       => '制作実績を検索',
            'not_found'          => '制作実績が見つかりません',
            'not_found_in_trash' => 'ゴミ箱に制作実績はありません',
        ],
        'public'       => true,
        'has_archive'  => true,
        'rewrite'      => ['slug' => 'works'],
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-portfolio',
        'supports'     => ['title', 'editor', 'thumbnail', 'revisions'],
        'taxonomies'   => ['works-category'],
    ]);

    register_post_type('voice', [
        'labels' => [
            'name'               => 'お客様の声',
            'singular_name'      => 'お客様の声',
            'add_new_item'       => 'お客様の声を追加',
            'edit_item'          => 'お客様の声を編集',
            'new_item'           => '新規お客様の声',
            'view_item'          => 'お客様の声を表示',
            'search_items'       => 'お客様の声を検索',
            'not_found'          => 'お客様の声が見つかりません',
            'not_found_in_trash' => 'ゴミ箱にお客様の声はありません',
        ],
        'public'       => true,
        'has_archive'  => false,
        'rewrite'      => ['slug' => 'voice'],
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-format-quote',
        'supports'     => ['title', 'revisions'],
    ]);
});

// ── Taxonomy ─────────────────────────────────────────────────────────────────

add_action('init', function (): void {
    register_taxonomy('works-category', 'works', [
        'labels' => [
            'name'              => '制作カテゴリー',
            'singular_name'     => '制作カテゴリー',
            'search_items'      => 'カテゴリーを検索',
            'all_items'         => 'すべてのカテゴリー',
            'parent_item'       => '親カテゴリー',
            'edit_item'         => 'カテゴリーを編集',
            'update_item'       => 'カテゴリーを更新',
            'add_new_item'      => 'カテゴリーを追加',
            'new_item_name'     => '新規カテゴリー名',
            'menu_name'         => '制作カテゴリー',
        ],
        'hierarchical'      => true,
        'show_in_rest'      => true,
        'show_admin_column' => true,
        'rewrite'           => ['slug' => 'works-category'],
    ]);
});

// ── Flush rewrite rules once after CPT/taxonomy registration ─────────────────

add_action('after_switch_theme', function (): void {
    flush_rewrite_rules();
    wp_get_theme()->delete_pattern_cache();
});

if (defined('WORDPRESS_DEBUG') || (defined('WP_DEBUG') && WP_DEBUG)) {
    add_action('init', function (): void {
        wp_get_theme()->delete_pattern_cache();
    }, 0);
}
