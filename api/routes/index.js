// ============================================================
// Main Routes Index
// ============================================================

const express = require('express');
const router = express.Router();

const propertiesRoutes = require('./properties');
const areasRoutes = require('./areas');
const estimateRoutes = require('./estimate');
const searchRoutes = require('./search');
const clientsRoutes = require('./clients');

router.use('/properties', propertiesRoutes);
router.use('/areas', areasRoutes);
router.use('/estimate', estimateRoutes);
router.use('/search', searchRoutes);
router.use('/clients', clientsRoutes);

module.exports = router;
