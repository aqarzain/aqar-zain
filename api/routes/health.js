const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime(),
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: e.message,
    });
  }
});

module.exports = router;
