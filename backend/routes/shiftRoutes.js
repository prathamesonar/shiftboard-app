const express = require('express');
const { createShift, getShifts, deleteShift } = require('../controllers/shiftController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .post(protect, admin, createShift)
    .get(protect, getShifts);

router.delete('/:id', protect, admin, deleteShift);

module.exports = router;