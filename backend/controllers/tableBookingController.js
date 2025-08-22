const TableBooking = require('../models/TableBooking');

// Create a booking
async function createBooking(req, res) {
    try {
        const { userId, date, time, numberOfPeople } = req.body;
        
        // Check if the user already has a booking
        const existingBooking = await TableBooking.findOne({ userId, status: { $ne: 'cancelled' } });
        if (existingBooking) {
            return res.status(400).json({ message: 'You already have an active booking.' });
        }

        const booking = new TableBooking({ userId, date, time, numberOfPeople });
        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get user bookings
async function getUserBookings(req, res) {
    try {
        const { userId } = req.params;
        const bookings = await TableBooking.find({ userId });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Cancel a booking
async function cancelBooking(req, res) {
    try {
        const { id } = req.params;
        const booking = await TableBooking.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking cancelled', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createBooking,
    getUserBookings,
    cancelBooking,
};