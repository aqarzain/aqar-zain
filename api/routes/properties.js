// ============================================================
// Properties Routes
// ============================================================

const express = require('express');
const router = express.Router();
const controller = require('../controllers/propertiesController');
const { writeLimiter } = require('../middleware/rateLimiter');

// القراءة (بدون rate limit صارم لبناء الموقع)
router.get('/', controller.getAllProperties);
router.get('/stats', controller.getPropertyStats);
router.get('/:id', controller.getPropertyById);

// الكتابة (مع rate limit)
router.post('/', writeLimiter, controller.createProperty);
router.put('/:id', writeLimiter, controller.updateProperty);
router.delete('/:id', writeLimiter, controller.deleteProperty);

module.exports = router;
