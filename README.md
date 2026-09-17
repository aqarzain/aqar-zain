# 🏢 عقار زين (Aqar Zain)

منصة عقارية ذكية متكاملة للسوق المصري

## 🎯 نظرة عامة

عقار زين هو نظام متكامل لإدارة العقارات يتضمن:

- 🗄️ قاعدة بيانات PostgreSQL متقدمة
- 🖥️ API Server بـ Node.js
- 📱 تطبيق Android
- 🌐 موقع ويب
- 🤖 ذكاء اصطناعي لتقدير الأسعار
- 📊 تحليلات السوق

## 🏗️ الهيكل

aqar-zain/
├── api/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── android/
├── website/
├── database/
├── scripts/
├── docs/
└── logs/

## 🛠️ التقنيات

| المكون | التقنية |
|--------|---------|
| Backend | Node.js + Express |
| Database | PostgreSQL 18 |
| Mobile | Android |
| Frontend | Next.js + Tailwind CSS |
| Tunnel | Cloudflare Tunnel |
| Hosting | GitHub Pages |

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | فحص الحالة |
| GET | /api/properties | جميع العقارات |
| GET | /api/properties/:id | عقار محدد |
| GET | /api/properties/stats | الإحصائيات |
| POST | /api/properties | إضافة عقار |
| GET | /api/areas | المناطق |
| GET | /api/areas/:id | منطقة محددة |
| GET | /api/areas/stats | إحصائيات المناطق |
| GET | /api/clients | العملاء |
| POST | /api/estimate | تقدير السعر |
| GET | /api/estimate/:id | تقدير عقار موجود |
| GET | /api/search | البحث النصي |
| POST | /api/search/smart | البحث الذكي |
| POST | /api/search/extract | استخراج الكيانات |

## 🚀 التشغيل السريع

cd api && npm install
npm start
cloudflared tunnel --url http://localhost:3000

## 📄 الرخصة

MIT License

Built with ❤️ by Aqar Zain Team
