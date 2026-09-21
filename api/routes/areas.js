// ============================================================
// Areas Routes
// ============================================================

const express = require('express');
const router = express.Router();
const controller = require('../controllers/areasController');

// القراءة - بدون rate limit
router.get('/', controller.getAllAreas);
router.get('/stats', controller.getAreaStats);
router.get('/:id', controller.getAreaById);

module.exports = router;
