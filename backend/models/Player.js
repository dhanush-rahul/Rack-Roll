const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    name: { type: String, required: true },
    handicap: { type: Number, default: 0 },
    statistics: {
        totalScores: { type: Number, default: 0 }, // Total scores across all games
        averageScore: { type: Number, default: 0 }, // Average score per game
        gamesPlayed: { type: Number, default: 0 }, // Number of games played
    },
    tournaments: [{ type: Schema.Types.ObjectId, ref: 'Tournament' }],
    locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});
// Compound index for unique name and location
playerSchema.index({ name: 1, location: 1 }, { unique: true });

module.exports = mongoose.model('Player', playerSchema);