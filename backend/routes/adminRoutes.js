const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const {
  getAllUsers,
  getAllReports,
  getUserReports,
  getDashboardStats,
  searchUsers,
} = require('../controllers/adminController');

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);

// User routes
router.get('/users', getAllUsers);
router.get('/users/search', searchUsers);
router.get('/users/:userId/reports', getUserReports);

// Report routes
router.get('/reports', getAllReports);

module.exports = router;
