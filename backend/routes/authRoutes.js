const express = require('express');
const { loginUser, getEmployees } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/login', loginUser);
router.get('/employees', protect, admin, getEmployees);

module.exports = router;