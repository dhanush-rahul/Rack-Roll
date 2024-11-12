const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    player1: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    player2: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    scores: {
        player1: { type: Number, default: 0 },
        player2: { type: Number, default: 0 }
    },
    handicap_adjustment: { type: Number, default: 0 },
    date_played: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', gameSchema);
