// ============================================================
// Properties Routes
// ============================================================

const express = require('express');
const router = express.Router();
const controller = require('../controllers/propertiesController');
const { generalLimiter } = require('../middleware/rateLimiter');

router.get('/', generalLimiter, controller.getAllProperties);
router.get('/stats', controller.getPropertyStats);
router.get('/:id', controller.getPropertyById);
router.post('/', controller.createProperty);
router.put('/:id', controller.updateProperty);
router.delete('/:id', controller.deleteProperty);

module.exports = router;
