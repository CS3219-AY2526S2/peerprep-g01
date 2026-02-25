const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.listAdmins);

router.post('/create', adminController.createAdmin);

module.exports = router;