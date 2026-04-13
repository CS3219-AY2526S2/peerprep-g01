const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// // Middleware to verify JWT and check for admin role
// const authMiddleware = require('../middleware/authMiddleware');
// const adminOnlyMiddleware = require('../middleware/roleMiddleware');

// router.use(authMiddleware);
// router.use(adminOnlyMiddleware);

router.get('/', adminController.listAdmins);

router.post('/create', adminController.createAdmin);

router.delete('/delete', adminController.deleteAdmin);

module.exports = router;