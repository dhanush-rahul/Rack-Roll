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
        if (!locationId) {
            return res.status(400).json({ error: 'locationId is required' });
        }

        // Step 1: Find the location and get its tournaments
        const location = await Location.findById(locationId).populate('tournaments', '_id');
        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }

        const tournamentIds = location.tournaments.map((tournament) => tournament._id);

        // Step 2: Find all games for the tournaments
        const games = await Game.find({ tournamentId: { $in: tournamentIds } })
            .populate('player1 player2', 'name handicap')
            .lean();

        // Step 3: Aggregate players and their scores
        const playerScores = {};

        games.forEach((game) => {
            // Process Player 1
            if (!playerScores[game.player1._id]) {
                playerScores[game.player1._id] = {
                    name: game.player1.name,
                    handicap: game.player1.handicap,
                    scores: [],
                };
            }
            playerScores[game.player1._id].scores.push(...game.scores.map((s) => s.player1));

            // Process Player 2
            if (!playerScores[game.player2._id]) {
                playerScores[game.player2._id] = {
                    name: game.player2.name,
                    handicap: game.player2.handicap,
                    scores: [],
                };
            }
            playerScores[game.player2._id].scores.push(...game.scores.map((s) => s.player2));
        });

        // Step 4: Convert playerScores object into an array
        const players = Object.keys(playerScores).map((playerId) => ({
            _id: playerId,
            name: playerScores[playerId].name,
            handicap: playerScores[playerId].handicap,
            scores: playerScores[playerId].scores,
        }));

        res.status(200).json(players);
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
