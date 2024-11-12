const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tournamentSchema = new Schema({
    name: { type: String, required: true },
    location: { type: String },
    passKey: { type: String, required: true },
    divisions: [{ type: Schema.Types.ObjectId, ref: 'Division' }],
    date: { type: Date, required: true }
});

module.exports = mongoose.model('Tournament', tournamentSchema);
 