const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema({
    location: { type: String, required: true },
    passKey: { type: String, required: true },
    tournaments: [{ type: Schema.Types.ObjectId, ref: 'Tournament' }]
});

module.exports = mongoose.model('Location', locationSchema);
