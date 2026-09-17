// ============================================================
// Routes Index - تجميع المسارات
// ============================================================

const express = require('express');
const router = express.Router();

const propertiesRoutes = require('./properties');
const areasRoutes = require('./areas');
const estimateRoutes = require('./estimate');
const searchRoutes = require('./search');
const clientsRoutes = require('./clients');

// المسارات
router.use('/properties', propertiesRoutes);
router.use('/areas', areasRoutes);
router.use('/estimate', estimateRoutes);
router.use('/search', searchRoutes);
router.use('/clients', clientsRoutes);

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

module.exports = router;
