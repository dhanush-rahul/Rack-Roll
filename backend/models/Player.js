const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    name: { type: String, required: true, unique: true },
    handicap: { type: Number, default: 0},
    location: { type: Schema.Types.ObjectId, ref: 'Location'},

    created_timestamp: { type: Date, default: Date.now}
});
// Compound index for unique name and location
playerSchema.index({ name: 1, location: 1 }, { unique: true });

module.exports = mongoose.model('Player', playerSchema);