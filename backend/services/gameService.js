const Game = require('../models/Game');
const { mongoose } = require('mongoose');

// Create a new game
async function createGame(gameData) {
    const game = new Game(gameData);
    return await game.save();
}
async function createGames(games) {
    return await Game.insertMany(games); // Bulk-insert games for efficiency
}
// Get all games
async function getAllGames() {
    return await Game.find().populate('player1').populate('player2');
}

// Get a specific game by ID
async function getGameById(id) {
    return await Game.findById(id).populate('player1').populate('player2');
}

// Update a game by ID
async function updateGame(id, updateData) {
    return await Game.findByIdAndUpdate(id, updateData, { new: true });
}

// Delete a game by ID
async function deleteGame(id) {
    return await Game.findByIdAndDelete(id);
}

async function getGamesByTournament(tournamentId) {
    try {
        // Validate tournamentId
        if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
            throw new Error(`Invalid tournamentId: ${tournamentId}`);
        }

        // Convert to ObjectId
        const objectIdTournamentId = new mongoose.Types.ObjectId(tournamentId);

        // Query games for the tournament
        const games = await Game.find({ tournamentId: objectIdTournamentId })
            .populate('player1', 'name') // Populate player1 with name
            .populate('player2', 'name') // Populate player2 with name
            .exec();

        return games;
    } catch (error) {
        console.error('Error fetching games by tournament:', error);
        throw new Error('Failed to fetch games for the tournament');
    }
}
module.exports = {
    createGame,
    getAllGames,
    getGameById,
    updateGame,
    deleteGame,
    createGames,
    getGamesByTournament
};
