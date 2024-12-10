const { default: mongoose } = require('mongoose');
const Game = require('../models/Game');
const Leaderboard = require('../models/Leaderboard');
const gameService = require('../services/gameService');
const leaderboardService = require('../services/leaderboardService');
const playerService = require('../services/playerService');

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

async function updateGameWithId(req, res) {
    const { id } = req.params;
    const { player1Score, player2Score, gameIndex } = req.body;

    try {
        const game = await gameService.getGameById(id);
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }

        const existingScoreIndex = game.scores.findIndex(
            (score) => score.gameIndex === gameIndex
        );

        let previousPlayer1Score = 0;
        let previousPlayer2Score = 0;

        if (existingScoreIndex >= 0) {
            previousPlayer1Score = parseFloat(game.scores[existingScoreIndex].player1) || 0;
            previousPlayer2Score = parseFloat(game.scores[existingScoreIndex].player2) || 0;

            game.scores[existingScoreIndex].player1 = player1Score;
            game.scores[existingScoreIndex].player2 = player2Score;
        } else {
            game.scores.push({
                gameIndex: gameIndex,
                player1: player1Score,
                player2: player2Score,
            });
        }

        const updatedGame = await game.save();
        const updatedGameObject = updatedGame.toObject();

        const tournamentId = game.tournamentId;
        let player1Division = game.division;
        let player2Division = game.division;

        const player1Id = game.player1;
        const player2Id = game.player2;

        const player1 = await playerService.getPlayerById(player1Id);
        const player2 = await playerService.getPlayerById(player2Id);

        if (!player1 || !player2) {
            throw new Error("One or both players not found");
        }

        if (!player1Division) {
            player1Division = await playerService.getPlayerDivision(player1Id, tournamentId);
        }
        if (!player2Division) {
            player2Division = await playerService.getPlayerDivision(player2Id, tournamentId);
        }

        if (!player1Division || !player2Division) {
            throw new Error("Division not found for one or both players in crossover match");
        }

        const player1Handicap = parseFloat(player1.handicap) || 0;
        const player2Handicap = parseFloat(player2.handicap) || 0;

        let previousPlayer1AdjustedScore = 0;
        let previousPlayer2AdjustedScore = 0;

        if (existingScoreIndex >= 0) {
            previousPlayer1AdjustedScore = previousPlayer1Score + player1Handicap;
            previousPlayer2AdjustedScore = previousPlayer2Score + player2Handicap;
        }

        let newPlayer1AdjustedScore = (parseFloat(player1Score) || 0) + player1Handicap;
        let newPlayer2AdjustedScore = (parseFloat(player2Score) || 0) + player2Handicap;

        if(existingScoreIndex >= 0){
            // Compute the score deltas
                newPlayer1AdjustedScore = newPlayer1AdjustedScore - previousPlayer1AdjustedScore;
                newPlayer2AdjustedScore = newPlayer2AdjustedScore - previousPlayer2AdjustedScore;
            }

        // Update both leaderboards
        await updateLeaderboard(
            tournamentId,
            player1Division,
            player1Id,
            null,
            newPlayer1AdjustedScore,
            0 // No change to player2's score in player1's division
        );

        await updateLeaderboard(
            tournamentId,
            player2Division,
            null,
            player2Id,
            0, // No change to player1's score in player2's division
            newPlayer2AdjustedScore
        );

        res.status(200).json({
            message: "Scores updated successfully",
            game: updatedGameObject,
        });
    } catch (error) {
        console.error("Error updating game scores:", error);
        res.status(500).json({ message: error.message });
    }
}


// Helper function to update the leaderboard
async function updateLeaderboard(
    tournamentId,
    divisionId,
    player1Id,
    player2Id,
    deltaPlayer1Score,
    deltaPlayer2Score
) {
    try {
        // Find or create the leaderboard for the division
        let leaderboard = await leaderboardService.getLeaderboard(tournamentId, divisionId);
        if (!leaderboard) {
            // Create a new leaderboard if it doesn't exist
            leaderboard = new Leaderboard({
                tournamentId,
                division: divisionId,
                rankings: new Map(),
            });
        }
        // console.log("Player1: "+ player1Id)
        if (player1Id) {
            // Use the player ID string as the key
            const player1Key = player1Id._id;
            const currentScore1 = leaderboard.rankings.get(player1Key) || 0;
            leaderboard.rankings.set(player1Key, currentScore1 + deltaPlayer1Score);
        }

        if (player2Id) {
            // Use the player ID string as the key
            const player2Key = player2Id._id;
            const currentScore2 = leaderboard.rankings.get(player2Key) || 0;
            leaderboard.rankings.set(player2Key, currentScore2 + deltaPlayer2Score);
        }

        // Save the updated leaderboard
        await leaderboard.save();
    } catch (error) {
        console.error('Error updating leaderboard:', error);
        throw error;
    }
}

async function getMaxRounds(req, res) {
    try {
        const { tournamentId } = req.query; // Get tournamentId from query parameters
        
        if (!tournamentId) {
            return res.status(400).json({ error: 'tournamentId is required' });
        }

        // Convert the tournamentId to an ObjectId
        const objectIdTournamentId = new mongoose.Types.ObjectId(tournamentId);

        // Query to find the maximum round for the given tournament
        const result = await Game.aggregate([
            { $match: { tournamentId: objectIdTournamentId } }, // Filter by tournamentId
            { $group: { _id: null, maxRound: { $max: '$round' } } }, // Find the max round
        ]);

        const maxRound = result.length > 0 ? result[0].maxRound : 0; // Default to 0 if no games
        res.status(200).json({ maxRound });
    } catch (error) {
        console.error('Error fetching max rounds:', error);
        res.status(500).json({ error: 'Failed to fetch max rounds' });
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
    deleteGame,
    updateGameWithId,
    getMaxRounds
};
