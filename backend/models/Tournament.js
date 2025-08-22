import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const tournamentSchema = new Schema({
    tournamentName: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now }, // Add default value for the date
    locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true }, // Reference to the location conducting the tournament
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }], // Store participating players
    games: [{ type: Schema.Types.ObjectId, ref: 'Game' }], // Add a reference to the `Game` model for the tournament's games
    divisions: [{ type: Schema.Types.ObjectId, ref: 'Division' }], // Reference to divisions
    numDivisions: { type: Number, required: true }, // Store the number of divisions directly
    numGamesPerMatchup: { type: Number, required: true }, // Store the number of games to be played for each matchup
});

export default model('Tournament', tournamentSchema);
 