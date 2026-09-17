const express = require('express');
const router = express.Router();
const controller = require('../controllers/clientsController');

router.get('/', controller.getAllClients);
router.get('/:id', controller.getClientById);

module.exports = router;
