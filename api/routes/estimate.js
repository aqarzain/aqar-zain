const express = require('express');
const router = express.Router();
const controller = require('../controllers/estimateController');
const { estimateLimiter } = require('../middleware/rateLimiter');

router.post('/', estimateLimiter, controller.estimatePrice);
router.get('/:id', controller.estimateExistingProperty);

module.exports = router;
