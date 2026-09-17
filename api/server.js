// ============================================================
// Aqar Zain API Server
// ============================================================

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./routes');
const logger = require('./middleware/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// Middleware
// ============================================================

// الأمان
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));
app.use(logger);

// Rate limiting
app.use('/api', generalLimiter);

// ============================================================
// Routes
// ============================================================

app.get('/', (req, res) => {
    res.json({
        name: '🏢 Aqar Zain API',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/api/health',
            properties: '/api/properties',
            areas: '/api/areas',
            estimate: '/api/estimate',
            search: '/api/search',
            clients: '/api/clients'
        }
    });
});

app.use('/api', routes);

// ============================================================
// Error Handling
// ============================================================

app.use(notFoundHandler);
app.use(errorHandler);

// ============================================================
// Start Server
// ============================================================

app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('════════════════════════════════════════════════════════');
    console.log('🏢 Aqar Zain API Server');
    console.log('════════════════════════════════════════════════════════');
    console.log(`🚀 السيرفر يعمل على: http://localhost:${PORT}`);
    console.log(`📱 متاح للاتصال الداخلي: http://192.168.x.x:${PORT}`);
    console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📊 الإحصائيات: http://localhost:${PORT}/api/properties/stats`);
    console.log('════════════════════════════════════════════════════════');
    console.log('');
});

// معالجة الأخطاء غير المتوقعة
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});
