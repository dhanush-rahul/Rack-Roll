const Game = require('../models/Game');
const Player = require('../models/Player');
const Location = require('../models/Location');
const Tournament = require('../models/Tournament');
const playerService = require('../services/playerService');

async function createPlayer(req, res) {
    try {
        const { name, handicap, locationId } = req.body;
        // Check if the player already exists
        const existingPlayer = await Player.findOne({ name });
        if (existingPlayer) {
            return res.status(400).json({ message: `Player with name '${name}' already exists.` });
        }
        const location = await Location.findById(locationId)
        // Create a new player
        const player = new Player({ 
            name, 
            handicap: handicap != null ? handicap : 0,
            location
        });
        await player.save();    
        res.status(201).json(player);
    } catch (error) {
        if (error.code === 11000) {
            // Handle MongoDB duplicate key error
            return res.status(400).json({ message: 'Player with this name already exists.' });
        }
    
        console.error('Error creating player:', error);
        res.status(500).json({ message: error.message });
    }
}

async function getAllPlayers(req, res) {
    try {
        const players = await playerService.getAllPlayers();
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getPlayerById(req, res) {
    try {
        const player = await playerService.getPlayerById(req.params.id);
        if (!player) return res.status(404).json({ message: "Player not found" });
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updatePlayer(req, res) {
    try {
        const player = await playerService.updatePlayer(req.params.id, req.body);
        if (!player) return res.status(404).json({ message: "Player not found" });
        res.status(200).json(player);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function deletePlayer(req, res) {
    try {
        const player = await playerService.deletePlayer(req.params.id);
        if (!player) return res.status(404).json({ message: "Player not found" });
        res.status(200).json({ message: "Player deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// Search players by name
async function searchPlayers(req, res) {
    try {

        const query = req.query.query;

        if (!query || query.trim() === "") {
            return res.status(400).json({ message: "Query is required" });
        }

        // Explicitly search by `name` field
        const players = await Player.find({ name: new RegExp(query, 'i') });

        res.status(200).json(players);
    } catch (error) {
        console.error('Error searching players:', error);
        res.status(500).json({ message: error.message });
    }
}

async function getPlayersByLocation(req, res) {
    try {
        const { locationId } = req.query;

        // Validate locationId
        if (!locationId) {
            return res.status(400).json({ error: 'locationId is required' });
        }

        // Step 1: Fetch players based on location
        const players = await Player.find({ location: locationId })
            .select('_id name handicap') // Fetch only required fields
            .lean();

        if (!players.length) {
            return res.status(404).json({ error: 'No players found for this location' });
        }

        // Step 2: Fetch scores from games for the players
        const playerIds = players.map((player) => player._id);
        const games = await Game.find({ $or: [{ player1: { $in: playerIds } }, { player2: { $in: playerIds } }] })
            .select('player1 player2 scores')
            .lean();

        // Step 3: Aggregate scores for each player
        const playerScores = {};

        games.forEach((game) => {
            // Process Player 1 scores
            if (playerIds.includes(game.player1.toString())) {
                if (!playerScores[game.player1]) {
                    playerScores[game.player1] = [];
                }
                playerScores[game.player1].push(...game.scores.map((s) => s.player1));
            }

            // Process Player 2 scores
            if (playerIds.includes(game.player2.toString())) {
                if (!playerScores[game.player2]) {
                    playerScores[game.player2] = [];
                }
                playerScores[game.player2].push(...game.scores.map((s) => s.player2));
            }
        });

        // Step 4: Combine players with their scores
        const result = players.map((player) => ({
            _id: player._id,
            name: player.name,
            handicap: player.handicap,
            scores: playerScores[player._id] || [],
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching players by location:', error);
        res.status(500).json({ error: 'Failed to fetch players by location' });
    }
}

module.exports = {
    createPlayer,
    getAllPlayers,
    getPlayerById,
    updatePlayer,
    deletePlayer,
    searchPlayers,
    getPlayersByLocation,
};
