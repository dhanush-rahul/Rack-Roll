const gameService = require('../services/gameService');

// Create a new game
async function createGame(req, res) {
    try {
        const game = await gameService.createGame(req.body);
        res.status(201).json(game);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Get all games
async function getAllGames(req, res) {
    try {
        const games = await gameService.getAllGames();
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get a game by ID
async function getGameById(req, res) {
    try {
        const game = await gameService.getGameById(req.params.id);
        if (!game) return res.status(404).json({ message: "Game not found" });
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a game by ID
async function updateGame(req, res) {
    try {
        const game = await gameService.updateGame(req.params.id, req.body);
        if (!game) return res.status(404).json({ message: "Game not found" });
        res.status(200).json(game);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete a game by ID
async function deleteGame(req, res) {
    try {
        const game = await gameService.deleteGame(req.params.id);
        if (!game) return res.status(404).json({ message: "Game not found" });
        res.status(200).json({ message: "Game deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createGame,
    getAllGames,
    getGameById,
    updateGame,
    deleteGame
};
