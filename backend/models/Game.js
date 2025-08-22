import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const gameSchema = new Schema({
    player1: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    player2: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    scores: [
        {
            gameIndex: { type: Number, required: true }, // Index of the game in a round
            player1: { type: Number, required: true }, // Score of Player 1
            player2: { type: Number, required: true }  // Score of Player 2
        }
    ],
    round: { type: Number, required: true }, // Round number
    division: { type: Schema.Types.ObjectId, ref: 'Division' },
    tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
    date_played: { type: Date, default: Date.now }
});

// Add a `toJSON` transformation to serialize nested objects properly
gameSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        // Ensure `scores` array is transformed into plain objects
        ret.scores = ret.scores.map((score) => ({
            gameIndex: score.gameIndex,
            player1: score.player1,
            player2: score.player2,
        }));

        // Remove unnecessary fields
        delete ret.__v;
        return ret;
    },
});
export default model('Game', gameSchema);
