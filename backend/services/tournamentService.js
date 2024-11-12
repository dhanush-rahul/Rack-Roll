const Tournament = require('../models/Tournament');

// Create a new tournament
async function createTournament(tournamentData) {
    const tournament = new Tournament(tournamentData);
    return await tournament.save();
}

// Get all tournaments
async function getAllTournaments() {
    return await Tournament.find();
}

// Get a specific tournament by ID
async function getTournamentById(id) {
    return await Tournament.findById(id);
}

// Update a tournament by ID
async function updateTournament(id, updateData) {
    return await Tournament.findByIdAndUpdate(id, updateData, { new: true });
}

// Delete a tournament by ID
async function deleteTournament(id) {
    return await Tournament.findByIdAndDelete(id);
}

module.exports = {
    createTournament,
    getAllTournaments,
    getTournamentById,
    updateTournament,
    deleteTournament
};
