const express = require('express')
const router = express.Router()
const { register, login, logout } = require('../controllers/authController')

// call the register function
// when a POST request is made to http://localhost:8080/api/auth/register
router.route('/register').post(register)

// call the login function
// when a POST request is made to http://localhost:8080/api/auth/login
router.route('/login').post(login)

// call the logout function
// when a POST request is made to http://localhost:8080/api/auth/logout
router.route('/logout').post(logout)

module.exports = router