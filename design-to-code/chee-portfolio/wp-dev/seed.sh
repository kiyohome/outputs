#!/usr/bin/env bash
set -euo pipefail

CLI="docker compose run --rm cli wp --allow-root"
SEED_DIR=/var/www/html/seed
SEED_JSON="$(dirname "$0")/seed"

img_id_for() {
  local filename="$1"
  $CLI media import "$SEED_DIR/images/$filename" --title="$filename" --porcelain
}

# sections JSON配列 → WPブロックマークアップ文字列を生成する
build_post_content() {
  local sections="$1"
  local output=""
  local sec_count
  sec_count=$(echo "$sections" | jq 'length')

  for ((k=0; k<sec_count; k++)); do
    local title body_count
    title=$(echo "$sections" | jq -r ".[$k].title")
    body_count=$(echo "$sections" | jq ".[$k].body | length")

    if [ "$title" = "制作ツール" ]; then
      output+="<!-- wp:heading {\"level\":3,\"className\":\"works-section-title works-section-title--tool\"} -->"$'\n'
      output+="<h3 class=\"wp-block-heading works-section-title works-section-title--tool\">${title}</h3>"$'\n'
    else
      output+="<!-- wp:heading {\"level\":3,\"className\":\"works-section-title\"} -->"$'\n'
      output+="<h3 class=\"wp-block-heading works-section-title\">${title}</h3>"$'\n'
    fi
    output+="<!-- /wp:heading -->"$'\n'$'\n'

    for ((l=0; l<body_count; l++)); do
      local line
      line=$(echo "$sections" | jq -r ".[$k].body[$l]")
      output+="<!-- wp:paragraph -->"$'\n'
      output+="<p>${line}</p>"$'\n'
      output+="<!-- /wp:paragraph -->"$'\n'$'\n'
    done
  done

  echo "$output"
}

echo "=== Importing profile ==="
IMG_PROFILE=$(img_id_for "profile.webp")
$CLI option update chee_profile_photo_id "$IMG_PROFILE"
echo "  Profile photo ID: $IMG_PROFILE"

echo "=== Creating Works posts ==="

count=$(jq 'length' "$SEED_JSON/works.json")
for ((i=0; i<count; i++)); do
  post_title=$(jq -r ".[$i].post_title" "$SEED_JSON/works.json")
  post_date=$(jq -r ".[$i].post_date" "$SEED_JSON/works.json")
  post_excerpt=$(jq -r ".[$i].post_excerpt" "$SEED_JSON/works.json")
  sections=$(jq -c ".[$i].sections" "$SEED_JSON/works.json")
  client_name=$(jq -r ".[$i].client_name" "$SEED_JSON/works.json")
  category_label=$(jq -r ".[$i].category_label" "$SEED_JSON/works.json")
  thumbnail=$(jq -r ".[$i].thumbnail" "$SEED_JSON/works.json")
  mockup_image=$(jq -r ".[$i].mockup_image" "$SEED_JSON/works.json")
  fv_featured=$(jq -r ".[$i].fv_featured" "$SEED_JSON/works.json")
  fv_order=$(jq -r ".[$i].fv_order" "$SEED_JSON/works.json")
  top_show=$(jq -r ".[$i].top_show // \"0\"" "$SEED_JSON/works.json")

  post_content=$(build_post_content "$sections")

  PID=$($CLI post create \
    --post_type=works \
    --post_title="$post_title" \
    --post_status=publish \
    --post_date="$post_date" \
    --post_excerpt="$post_excerpt" \
    --porcelain)

  $CLI post update "$PID" --post_content="$post_content"
  [ -n "$client_name" ]    && $CLI post meta update "$PID" client_name "$client_name"
  [ -n "$category_label" ] && $CLI post meta update "$PID" category_label "$category_label"

  if [ -n "$thumbnail" ]; then
    tid=$(img_id_for "$thumbnail")
    $CLI post meta update "$PID" thumbnail "$tid"
    echo "    thumbnail: $thumbnail → ID $tid"
  fi

  if [ -n "$mockup_image" ]; then
    mid=$(img_id_for "$mockup_image")
    $CLI post meta update "$PID" mockup_image "$mid"
    echo "    mockup: $mockup_image → ID $mid"
  fi

  # 詳細画像（detail_images）をインポートしてIDをカンマ区切りで保存
  detail_count=$(jq ".[$i].detail_images | length" "$SEED_JSON/works.json")
  if [ "$detail_count" -gt 0 ]; then
    detail_ids=""
    for ((j=0; j<detail_count; j++)); do
      dimg=$(jq -r ".[$i].detail_images[$j]" "$SEED_JSON/works.json")
      did=$(img_id_for "$dimg")
      detail_ids="${detail_ids:+${detail_ids},}${did}"
      echo "    detail: $dimg → ID $did"
    done
    $CLI post meta update "$PID" detail_images "$detail_ids"
  fi

  $CLI post meta update "$PID" fv_featured "$fv_featured"
  $CLI post meta update "$PID" fv_order "$fv_order"
  $CLI post meta update "$PID" top_show "$top_show"

  categories=$(jq -r ".[$i].categories[]" "$SEED_JSON/works.json" | tr '\n' ' ')
  # shellcheck disable=SC2086
  $CLI post term set "$PID" works-category $categories

  echo "  Works #$PID: $post_title"
done

echo "=== Creating Voice posts ==="

count=$(jq 'length' "$SEED_JSON/voice.json")
for ((i=count-1; i>=0; i--)); do
  post_title=$(jq -r ".[$i].post_title" "$SEED_JSON/voice.json")
  post_date=$(jq -r ".[$i].post_date" "$SEED_JSON/voice.json")
  voice_photo=$(jq -r ".[$i].voice_photo" "$SEED_JSON/voice.json")
  voice_role=$(jq -r ".[$i].voice_role" "$SEED_JSON/voice.json")
  voice_name=$(jq -r ".[$i].voice_name" "$SEED_JSON/voice.json")
  voice_catchphrase=$(jq -r ".[$i].voice_catchphrase" "$SEED_JSON/voice.json")
  voice_body=$(jq -r ".[$i].voice_body" "$SEED_JSON/voice.json")

  PID=$($CLI post create \
    --post_type=voice \
    --post_title="$post_title" \
    --post_status=publish \
    --post_date="$post_date" \
    --porcelain)

  if [ -n "$voice_photo" ]; then
    vid=$(img_id_for "$voice_photo")
    $CLI post meta update "$PID" voice_photo "$vid"
    echo "    photo: $voice_photo → ID $vid"
  fi

  $CLI post meta update "$PID" voice_role "$voice_role"
  $CLI post meta update "$PID" voice_name "$voice_name"
  $CLI post meta update "$PID" voice_catchphrase "$voice_catchphrase"
  $CLI post meta update "$PID" voice_body "$voice_body"

  echo "  Voice #$PID: $post_title"
done

echo "=== Done ==="
$CLI post list --post_type=works --fields=ID,post_title,post_status
$CLI post list --post_type=voice --fields=ID,post_title,post_status
