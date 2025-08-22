const Tournament = require('../models/Tournament').default;
const mongoose = require('mongoose');
// Create a new tournament
async function createTournament(tournamentData) {
    const tournament = new Tournament(tournamentData);
    return await tournament.save();
}

// Get all tournaments
async function getAllTournaments() {
    return await Tournament.aggregate([
        // Lookup divisions and populate details
        {
            $lookup: {
                from: 'divisions', // The collection name for divisions
                localField: 'divisions',
                foreignField: '_id',
                as: 'divisionDetails'
            }
        },
        // Lookup players and populate details
        {
            $lookup: {
                from: 'players', // The collection name for players
                localField: 'players',
                foreignField: '_id',
                as: 'playerDetails'
            }
        },
        // Lookup games and populate details
        {
            $lookup: {
                from: 'games', // The collection name for games
                localField: 'games',
                foreignField: '_id',
                as: 'gameDetails'
            }
        },
        // Add calculated fields for division count and player count
        {
            $addFields: {
                divisionCount: { $size: "$divisionDetails" }, // Total number of divisions
                playerCount: { 
                    $sum: { 
                        $map: { 
                            input: "$divisionDetails", 
                            as: "division", 
                            in: { $size: "$$division.players" } 
                        } 
                    } 
                },
                totalGames: { $size: "$gameDetails" }, // Total number of games
            }
        },
        // Project required fields
        {
            $project: {
                tournamentName: 1,
                date: 1,
                locationId: 1,
                numDivisions: 1,
                numGamesPerMatchup: 1,
                divisionCount: 1,
                playerCount: 1,
                totalGames: 1
            }
        }
    ]);
}
async function getTournamentsByLocationId(locationId) {
    const objectId = new mongoose.Types.ObjectId(locationId);

    return await Tournament.aggregate([
        // Match tournaments with the specified locationId
        {
            $match: { locationId: objectId }
        },
        // Lookup divisions and populate details
        {
            $lookup: {
                from: 'divisions',
                localField: 'divisions',
                foreignField: '_id',
                as: 'divisionDetails'
            }
        },
        // Lookup players and populate details
        {
            $lookup: {
                from: 'players',
                localField: 'players',
                foreignField: '_id',
                as: 'playerDetails'
            }
        },
        // Lookup games and populate details
        {
            $lookup: {
                from: 'games',
                localField: 'games',
                foreignField: '_id',
                as: 'gameDetails'
            }
        },
        // Add calculated fields for division count and player count
        {
            $addFields: {
                divisionCount: { $size: "$divisionDetails" }, // Total number of divisions
                playerCount: { 
                    $sum: { 
                        $map: { 
                            input: "$divisionDetails", 
                            as: "division", 
                            in: { $size: "$$division.players" } 
                        } 
                    } 
                },
                totalGames: { $size: "$gameDetails" }, // Total number of games
                crossoverGames: {
                    $size: {
                        $filter: {
                            input: "$gameDetails",
                            as: "game",
                            cond: { $eq: ["$$game.isCrossover", true] }
                        }
                    }
                }
            }
        },
        // Sort by date in descending order (reverse order)
        {
            $sort: { date: -1 }
        },
        // Project required fields
        {
            $project: {
                tournamentName: 1,
                date: 1,
                locationId: 1,
                numDivisions: 1,
                numGamesPerMatchup: 1,
                divisionCount: 1,
                playerCount: 1,
                totalGames: 1,
                crossoverGames: 1
            }
        }
    ]);
}

async function countTournamentsByLocationId(locationId) {
    const locationIdObject = mongoose.isValidObjectId(locationId) ? new mongoose.Types.ObjectId(locationId) : locationId;
    return await Tournament.aggregate([
        // Match tournaments with the specified locationId
        {
            $match: { locationId: locationIdObject }
        },
        // Count the number of matching tournaments
        {
            $count: "tournamentCount"
        }
    ]);
}
async function getTournamentsByLocation(locationId) {
    return Tournament.find({ locationId });
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
    deleteTournament,
    getTournamentsByLocationId,
    countTournamentsByLocationId,
    getTournamentsByLocation
};
