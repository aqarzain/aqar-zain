#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# توليد sitemap.xml يدوياً
# ============================================================

DIST="$HOME/aqar-zain/website/dist"
SITE_URL="https://aqarzain.github.io/aqar-zain"
API_URL="http://localhost:3000"
OUTPUT="$DIST/sitemap.xml"

echo "🗺️  توليد sitemap.xml..."
echo "   المخرج: $OUTPUT"

{
  echo '<?xml version="1.0" encoding="UTF-8"?>'
  echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

  # الصفحات الثابتة
  for page in "" "properties/" "areas/" "estimate/" "services/" "about/" "contact/"; do
    echo "  <url>"
    echo "    <loc>${SITE_URL}/${page}</loc>"
    echo "    <changefreq>weekly</changefreq>"
    echo "    <priority>0.8</priority>"
    echo "  </url>"
  done

  # العقارات
  IDS=$(curl -s "${API_URL}/api/properties?limit=1000" | python3 -c "import json,sys; print(' '.join(str(p['id']) for p in json.load(sys.stdin).get('data',[])))" 2>/dev/null)
  for id in $IDS; do
    echo "  <url>"
    echo "    <loc>${SITE_URL}/properties/${id}/</loc>"
    echo "    <changefreq>weekly</changefreq>"
    echo "    <priority>0.9</priority>"
    echo "  </url>"
  done

  # المناطق (أول 30)
  AREA_IDS=$(curl -s "${API_URL}/api/areas" | python3 -c "import json,sys; print(' '.join(str(a['id']) for a in json.load(sys.stdin).get('data',[])[:30]))" 2>/dev/null)
  for id in $AREA_IDS; do
    echo "  <url>"
    echo "    <loc>${SITE_URL}/areas/${id}/</loc>"
    echo "    <changefreq>monthly</changefreq>"
    echo "    <priority>0.6</priority>"
    echo "  </url>"
  done

  echo '</urlset>'
} > "$OUTPUT"

echo "✅ تم إنشاء $OUTPUT"
wc -l "$OUTPUT"
