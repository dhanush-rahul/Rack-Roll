const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaderboardSchema = new Schema({
    division: { type: Schema.Types.ObjectId, ref: 'Division' },
    rankings: { type: Map, of: Number },  // {Player ID: Score}
    tournamentId: {type: Schema.Types.ObjectId, ref: 'Tournament', required: true}
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
