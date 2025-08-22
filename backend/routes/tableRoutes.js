const express = require('express');
const router = express.Router();
const tableBookingController = require('../controllers/tableBookingController');

router.post('/book-table', tableBookingController.createBooking);
router.get('/:userId', tableBookingController.getUserBookings);
router.delete('/:id', tableBookingController.cancelBooking);

module.exports = router;
