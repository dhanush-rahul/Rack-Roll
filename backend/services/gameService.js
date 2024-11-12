const Game = require('../models/Game');

// Create a new game
async function createGame(gameData) {
    const game = new Game(gameData);
    return await game.save();
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

module.exports = {
    createGame,
    getAllGames,
    getGameById,
    updateGame,
    deleteGame
};
