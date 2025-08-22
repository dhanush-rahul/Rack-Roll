const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tableBookingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // e.g., '18:30'
    numberOfPeople: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TableBooking', tableBookingSchema);