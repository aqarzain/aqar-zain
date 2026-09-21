// ============================================================
// Rate Limiter - محدودية الطلبات
// ============================================================

const rateLimit = require('express-rate-limit');

// استثناء طلبات البناء (localhost)
const shouldSkip = (req) => {
  const ip = req.ip || req.connection?.remoteAddress || '';
  const ua = req.headers['user-agent'] || '';

  // السماح من localhost
  if (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1') {
    return true;
  }

  // السماح لطلبات البناء (node/undici/astro)
  if (ua.includes('node') || ua.includes('undici') || ua.includes('astro')) {
    return true;
  }

  return false;
};

// 1. Limiter عام
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // دقيقة
  max: 200,                  // 200 طلب
  standardHeaders: true,
  legacyHeaders: false,
  skip: shouldSkip,
  message: { success: false, error: 'تم تجاوز عدد الطلبات المسموح' },
});

// 2. Limiter للبحث
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  skip: shouldSkip,
  message: { success: false, error: 'تم تجاوز عدد طلبات البحث' },
});

// 3. Limiter للتقدير
const estimateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: shouldSkip,
  message: { success: false, error: 'تم تجاوز عدد طلبات التقدير' },
});

// 4. Limiter للكتابة (جديد - مهم)
const writeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: shouldSkip,
  message: { success: false, error: 'تم تجاوز عدد طلبات الكتابة' },
});

module.exports = {
  generalLimiter,
  searchLimiter,
  estimateLimiter,
  writeLimiter,
};
