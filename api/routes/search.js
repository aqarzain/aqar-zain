const express = require('express');
const router = express.Router();
const controller = require('../controllers/searchController');
const { searchLimiter } = require('../middleware/rateLimiter');

router.get('/', searchLimiter, controller.searchByText);
router.post('/smart', searchLimiter, controller.smartSearch);
router.post('/extract', controller.extractEntities);

module.exports = router;
