#!/data/data/com.termux/files/usr/bin/bash

echo "════════════════════════════════════════════════════════"
echo "🚀 تشغيل عقار زين - كل الخدمات"
echo "════════════════════════════════════════════════════════"
echo ""

# 1. تشغيل PostgreSQL
echo "1️⃣ تشغيل PostgreSQL..."
if pg_ctl -D $PREFIX/var/lib/postgresql status > /dev/null 2>&1; then
    echo "   ✅ PostgreSQL يعمل مسبقاً"
else
    pg_ctl -D $PREFIX/var/lib/postgresql start
    echo "   ✅ تم تشغيل PostgreSQL"
fi
sleep 3

# 2. تشغيل API Server
echo ""
echo "2️⃣ تشغيل API Server..."
cd ~/aqar-zain/api
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "   ✅ API Server يعمل مسبقاً"
else
    nohup node server.js > ~/aqar-zain/logs/api.log 2>&1 &
    echo "   ✅ تم تشغيل API Server"
fi
sleep 3

# 3. تشغيل Cloudflare Tunnel
echo ""
echo "3️⃣ تشغيل Cloudflare Tunnel..."
if pgrep -f "cloudflared tunnel" > /dev/null; then
    echo "   ✅ Cloudflare Tunnel يعمل مسبقاً"
else
    nohup cloudflared tunnel --url http://localhost:3000 > ~/aqar-zain/logs/tunnel.log 2>&1 &
    echo "   ✅ تم تشغيل Cloudflare Tunnel"
fi
sleep 5

# 4. عرض الرابط
echo ""
echo "════════════════════════════════════════════════════════"
echo "✅ النظام جاهز!"
echo "════════════════════════════════════════════════════════"
echo ""
echo "📊 معلومات:"
echo "  • API المحلي: http://localhost:3000"
echo "  • API العام: (اعرض الرابط من logs/tunnel.log)"
echo "  • Logs API: ~/aqar-zain/logs/api.log"
echo "  • Logs Tunnel: ~/aqar-zain/logs/tunnel.log"
echo ""

# استخراج الرابط العام
sleep 2
TUNNEL_URL=$(grep -oP 'https://[a-z-]+\.trycloudflare\.com' ~/aqar-zain/logs/tunnel.log | head -1)
if [ -n "$TUNNEL_URL" ]; then
    echo "🌐 الرابط العام: $TUNNEL_URL"
fi
