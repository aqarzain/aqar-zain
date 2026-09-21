#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# سكربت النشر على GitHub Pages
# ============================================================

set -e

PROJECT_DIR="$HOME/aqar-zain"
WEBSITE_DIR="$PROJECT_DIR/website"
LOGS_DIR="$PROJECT_DIR/logs"

echo "🚀 بدء عملية النشر..."
echo ""

# 1) التأكد من عمل API
echo "🔍 فحص API..."
if curl -s "http://localhost:3000/api/health" > /dev/null 2>&1; then
  echo "✅ API يعمل"
else
  echo "⚠️  API لا يعمل - سيعمل الموقع بدون بيانات"
fi
echo ""

# 2) بناء الموقع
echo "📦 بناء الموقع..."
cd "$WEBSITE_DIR"
npm run build

echo "✅ تم البناء"
echo ""

# 3) النشر
echo "📤 نشر على GitHub Pages..."
if command -v npx > /dev/null 2>&1; then
  npx gh-pages -d dist -b gh-pages -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "✅ تم النشر"
else
  echo "❌ gh-pages غير مثبت. نفّذ: npm install -g gh-pages"
  exit 1
fi

echo ""
echo "🌐 الموقع: https://aqarzain.github.io/aqar-zain/"
echo "✅ اكتمل النشر بنجاح!"
