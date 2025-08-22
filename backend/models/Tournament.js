const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tournamentSchema = new Schema({
    tournamentName: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now }, // Add default value for the date
    locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true }, // Reference to the location conducting the tournament
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    maxPlayers: {type: Number, required: true, default:1},
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }], // Store participating players
    games: [{ type: Schema.Types.ObjectId, ref: 'Game' }], // Add a reference to the `Game` model for the tournament's games
    divisions: [{ type: Schema.Types.ObjectId, ref: 'Division' }], // Reference to divisions
    numDivisions: { type: Number }, // Store the number of divisions directly
    numGamesPerMatchup: { type: Number }, // Store the number of games to be played for each matchup
    isPublic: { type: Boolean, default: true },
    allowShuffle: { type: Boolean, default: false },
});

module.exports = mongoose.model('Tournament', tournamentSchema);
 