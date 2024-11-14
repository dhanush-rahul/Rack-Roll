const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    name: { type: String, required: true, unique: true },
    handicap: { type: Number, default: 0},
    created_timestamp: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Player', playerSchema);