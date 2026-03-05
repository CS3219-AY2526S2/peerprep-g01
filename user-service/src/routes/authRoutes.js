const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

// call the register function
// when a POST request is made to http://localhost:3001/api/auth/register
router.post('/register', authController.register)

// call the login function
// when a POST request is made to http://localhost:3001/api/auth/login
router.post('/login', authController.login)

// call the logout function
// when a POST request is made to http://localhost:3001/api/auth/logout
router.post('/logout', authController.logout)

module.exports = router