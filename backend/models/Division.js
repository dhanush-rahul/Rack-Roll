const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const divisionSchema = new Schema({
    division_name: { type: String, required: true },
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    games: [{ type: Schema.Types.ObjectId, ref: 'Game' }]
});

module.exports = mongoose.model('Division', divisionSchema);
