const tournamentService = require('../services/tournamentService');

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

module.exports = {
    createTournament,
    getAllTournaments,
    getTournamentById,
    updateTournament,
    deleteTournament
};