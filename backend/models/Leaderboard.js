const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaderboardSchema = new Schema({
    division: { type: Schema.Types.ObjectId, ref: 'Division', required: true },
    rankings: { type: Map, of: Number }  // {Player ID: Score}
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
