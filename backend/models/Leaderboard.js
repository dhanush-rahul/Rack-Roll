import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const leaderboardSchema = new Schema({
    division: { type: Schema.Types.ObjectId, ref: 'Division' },
    rankings: { type: Map, of: Number },  // {Player ID: Score}
    tournamentId: {type: Schema.Types.ObjectId, ref: 'Tournament', required: true}
});

export default model('Leaderboard', leaderboardSchema);
