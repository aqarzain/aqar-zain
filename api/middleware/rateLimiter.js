const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, error: 'تم تجاوز عدد الطلبات المسموح' }
});

const searchLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30,
    message: { success: false, error: 'تم تجاوز عدد طلبات البحث' }
});

const estimateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: { success: false, error: 'تم تجاوز عدد طلبات التقدير' }
});

module.exports = { generalLimiter, searchLimiter, estimateLimiter };
