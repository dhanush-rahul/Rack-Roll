import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const divisionSchema = new Schema({
    name: { type: String, required: true },
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    games: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
    tournamentId: { type: String, required: true},
});

export default model('Division', divisionSchema);
