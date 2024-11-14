const Player = require('../models/Player');
const playerService = require('../services/playerService');

async function createPlayer(req, res) {
    try {
        const { name, handicap } = req.body;

        // Create a new player
        const player = new Player({ name, handicap });
        await player.save();

        res.status(201).json(player);
    } catch (error) {
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
        console.log("Entered searchPlayers function"); // Log on function entry

        const query = req.query.query;
        console.log("Received query:", query);

        if (!query || query.trim() === "") {
            return res.status(400).json({ message: "Query is required" });
        }

        // Log before the query is executed
        console.log("Executing search with regex:", new RegExp(query, 'i'));

        // Explicitly search by `name` field
        const players = await Player.find({ name: new RegExp(query, 'i') });
        console.log("Players found:", players); // Log players found

        res.status(200).json(players);
    } catch (error) {
        console.error('Error searching players:', error);
        res.status(500).json({ message: error.message });
    }
}
module.exports = {
    createPlayer,
    getAllPlayers,
    getPlayerById,
    updatePlayer,
    deletePlayer,
    searchPlayers
};
