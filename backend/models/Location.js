const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String },
    tournaments: [{ type: Schema.Types.ObjectId, ref: 'Tournament' }],
    createdAt: { type: Date, default: Date.now },
});

locationSchema.index({ name: 1 }, { unique: true }); // Ensures unique location names for easy identification

module.exports = mongoose.model('Location', locationSchema);
