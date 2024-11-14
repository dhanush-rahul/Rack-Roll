const Tournament = require('../models/Tournament');
const tournamentService = require('../services/tournamentService');
const Player = require('../models/Player');

// Handle creating a new tournament
async function createTournament(req, res) {
    try {
        const tournament = await tournamentService.createTournament(req.body);
        res.status(201).json(tournament);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Handle fetching all tournaments
async function getAllTournaments(req, res) {
    try {
        const tournaments = await tournamentService.getAllTournaments();
        res.status(200).json(tournaments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Handle fetching a single tournament by ID
async function getTournamentById(req, res) {
    try {
        const tournament = await tournamentService.getTournamentById(req.params.id);
        if (!tournament) {
            return res.status(404).json({ message: "Tournament not found" });
        }
        res.status(200).json(tournament);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Handle updating a tournament
async function updateTournament(req, res) {
    try {
        const tournament = await tournamentService.updateTournament(req.params.id, req.body);
        if (!tournament) {
            return res.status(404).json({ message: "Tournament not found" });
        }
        res.status(200).json(tournament);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Handle deleting a tournament
async function deleteTournament(req, res) {
    try {
        const tournament = await tournamentService.deleteTournament(req.params.id);
        if (!tournament) {
            return res.status(404).json({ message: "Tournament not found" });
        }
        res.status(200).json({ message: "Tournament deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function getLocationTournamentCount(req, res) {
    try {
        const locationId = req.params.locationId;

        // Count documents for the provided valid locationId
        const count = await Tournament.countDocuments({ locationId });
        console.log("Tournament count for locationId:", locationId, "is", count);

        // Return count, explicitly setting it to 0 if there are no results
        return res.status(200).json({ count: count || 0 });
    } catch (error) {
        console.error("Error in getLocationTournamentCount:", error.message);
        res.status(500).json({ message: error.message });
    }
}

// Add a player to a specific tournament
async function addPlayerToTournament(req, res) {
    try {
        const { tournamentId } = req.params;
        const { playerId } = req.body;

        // Find the tournament
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        // Check if player already exists in the tournament
        if (tournament.players.includes(playerId)) {
            return res.status(400).json({ message: 'Player already added to this tournament' });
        }

        // Add the player to the tournament
        tournament.players.push(playerId);
        await tournament.save();

        res.status(200).json({ message: 'Player added to tournament successfully', tournament });
    } catch (error) {
        console.error('Error adding player to tournament:', error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createTournament,
    getAllTournaments,
    getTournamentById,
    updateTournament,
    deleteTournament,
    getLocationTournamentCount,
    addPlayerToTournament
};
