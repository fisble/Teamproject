const express = require('express');
const { register, login, registerAdmin, loginAdmin } = require('../controllers/authController');

const router = express.Router();

// User routes
router.post('/register', register);
router.post('/login', login);

// Admin routes
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);

module.exports = router;
