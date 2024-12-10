const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const divisionSchema = new Schema({
    name: { type: String, required: true },
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    games: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
    tournamentId: { type: String, required: true},
});

module.exports = mongoose.model('Division', divisionSchema);
