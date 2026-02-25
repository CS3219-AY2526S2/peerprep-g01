const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.listAdmins);

router.post('/create', adminController.createAdmin);

router.delete('/delete', adminController.deleteAdmin);

module.exports = router;