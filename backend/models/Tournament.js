const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tournamentSchema = new Schema({
    name: { type: String, required: true },
    divisions: [{ type: Schema.Types.ObjectId, ref: 'Division' }],
    date: { type: Date, required: true },
    locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true }, // Reference to the location conducting the tournament
});

module.exports = mongoose.model('Tournament', tournamentSchema);
 