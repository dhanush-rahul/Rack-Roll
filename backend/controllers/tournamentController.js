const Tournament = require('../models/Tournament');
const tournamentService = require('../services/tournamentService');
const Player = require('../models/Player');
const gameService = require('../services/gameService');
const divisionService = require('../services/divisionService');
const Location = require('../models/Location');
const Game = require('../models/Game');

async function createTournament(req, res) {
    try {
        const tournament = await tournamentService.createTournament(req.body);
        res.status(201).json(tournament);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getAllTournaments(req, res) {
    try {
        const tournaments = await tournamentService.getAllTournaments();
        res.status(200).json(tournaments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getTournamentsByLocation(req, res) {
    try {
        const { locationId } = req.params;
        const tournaments = await tournamentService.getTournamentsByLocationId(locationId);
        if (!tournaments || tournaments.length === 0) {
            return res.status(404).json({ message: "No tournaments found for this location." });
        }
        res.status(200).json(tournaments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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
        const count = await Tournament.countDocuments({ locationId });
        return res.status(200).json({ count: count || 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function addPlayerToTournament(req, res) {
    try {
        const { tournamentId } = req.params;
        const { playerId } = req.body;
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }
        if (tournament.players.includes(playerId)) {
            return res.status(400).json({ message: 'Player already added to this tournament' });
        }
        tournament.players.push(playerId);
        await tournament.save();
        res.status(200).json({ message: 'Player added to tournament successfully', tournament });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function createTournamentWithGames(req, res) {

    try {
        const { players, numDivisions, numGames, tournamentName, locationId } = req.body;
        const result = await tournamentService.countTournamentsByLocationId(locationId);
        const tournamentCount = result.length > 0 ? result[0].tournamentCount : 0;
        const name = `${tournamentName} ${tournamentCount + 1}`;
        console.log(players);
        const newTournament = await tournamentService.createTournament({
            tournamentName: name,
            date: new Date(),
            locationId,
            players,
            numDivisions,
            numGamesPerMatchup: numGames,
        });
        console.log("Created New Tournament")
        const divisionSize = Math.ceil(players.length / numDivisions);
        const divisionIds = [];
        const allGames = [];
        const allByes = [];

        for (let i = 0; i < numDivisions; i++) {
            const divisionPlayers = players.slice(i * divisionSize, (i + 1) * divisionSize);
            const division = await divisionService.createDivision({
                name: `Division ${i + 1}`,
                players: divisionPlayers,
                tournamentId: newTournament._id,
            });
            divisionIds.push(division._id);
            const { games: divisionGames, byes } = generateRoundRobinGames(
                divisionPlayers,
                numGames,
                division._id,
                newTournament._id
            );
            allGames.push(...divisionGames);
            allByes.push(...byes);
        }
        const crossoverGames = generateCrossoverMatches(allByes, numGames, newTournament._id);
        allGames.push(...crossoverGames);
        newTournament.divisions = divisionIds;
        const savedGames = await gameService.createGames(allGames);

        newTournament.games = savedGames.map((game) => game._id);
        await newTournament.save();
        const location = await Location.findById(locationId);
        if (!location) throw new Error('Location not found');
        location.tournaments.push(newTournament._id);
        await location.save();
        res.status(201).json({ message: 'Tournament and games created successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

function generateRoundRobinGames(players, numGames, divisionId, tournamentId) {
    const games = [];
    const byes = [];
    let numPlayers = players.length;
    let isAddedBye = false;
    if (numPlayers % 2 !== 0) {
        players.push({ name: 'Bye', _id: 'bye' });
        numPlayers += 1;
        isAddedBye = true;
    }
    const totalRounds = numPlayers - 1;
    const halfSize = numPlayers / 2;
    for (let round = 0; round < totalRounds; round++) {
        for (let i = 0; i < halfSize; i++) {
            const firstPlayerIndex = (round + i) % (numPlayers - 1);
            let secondPlayerIndex = (numPlayers - 1 - i + round) % (numPlayers - 1);
            if (i === 0) {
                secondPlayerIndex = numPlayers - 1;
            }
            const player1 = players[firstPlayerIndex];
            const player2 = players[secondPlayerIndex];
            if (player1._id === 'bye' || player2._id === 'bye') {
                const byePlayer = player1._id === 'bye' ? player2._id : player1._id;
                byes.push({ round: round + 1, playerId: byePlayer, divisionId });
                continue;
            }
            for (let gameIndex = 0; gameIndex < numGames; gameIndex++) {
                games.push({
                    player1: player1._id,
                    player2: player2._id,
                    scores: [],
                    round: round + 1,
                    division: divisionId,
                    tournamentId: tournamentId,
                    isCrossover: false
                });
            }
        }
    }
    if (isAddedBye) {
        players.pop();
    }
    return { games, byes };
}

function generateCrossoverMatches(allByes, numGames, tournamentId) {
    const crossoverGames = [];
    const byesByRound = allByes.reduce((acc, b) => {
        if (!acc[b.round]) acc[b.round] = [];
        acc[b.round].push(b);
        return acc;
    }, {});
    for (const roundStr in byesByRound) {
        const round = parseInt(roundStr, 10);
        const roundByes = byesByRound[round];
        while (roundByes.length > 1) {
            const bye1 = roundByes.pop();
            let pairIndex = roundByes.findIndex(b => b.divisionId !== bye1.divisionId);
            if (pairIndex === -1) {
                roundByes.push(bye1);
                break;
            }
            const bye2 = roundByes.splice(pairIndex, 1)[0];
            for (let gameIndex = 0; gameIndex < numGames; gameIndex++) {
                crossoverGames.push({
                    player1: bye1.playerId,
                    player2: bye2.playerId,
                    scores: [],
                    round: round,
                    division: null,
                    tournamentId: tournamentId,
                    isCrossover: true
                });
            }
        }
    }
    return crossoverGames;
}

async function getScoresheet(req, res) {
    try {
        const { tournamentId } = req.params;
        const games = await gameService.getGamesByTournament(tournamentId);
        const rounds = {};
        games.forEach((game) => {
            if (!rounds[game.round]) rounds[game.round] = [];
            rounds[game.round].push({
                player1: game.player1,
                player2: game.player2,
                scores: game.scores,
            });
        });
        res.status(200).json(Object.values(rounds));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getTournamentDetails(req, res) {
    try {
        const { id } = req.params;
        const tournament = await Tournament.findById(id)
            .populate('players')
            .populate('games')
            .populate({
                path: 'divisions',
                populate: {
                    path: 'players',
                },
            });
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }
        res.status(200).json(tournament);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function addRound(req, res) {
    console.log('addRound');
    try {
        const { tournamentId } = req.params;
        const { divisionId, isCrossover } = req.body;

        // Fetch the tournament details
        const tournament = await Tournament.findById(tournamentId)
            .populate('divisions')
            .populate('games');

        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        // Determine if this is a crossover or division-specific update
        // const isCrossover = divisionId === null || divisionId === undefined;

        // Fetch games for the specified division or all divisions
        const gamesToUpdate = tournament.games.filter((game) => {
            return isCrossover ? true : game.division?.toString() === divisionId;
        });

        if (!gamesToUpdate.length) {
            return res.status(404).json({ message: 'No games found to update.' });
        }

        const newGames = [];
        const groupedGames = {};

        // Group games by round and player matchup
        gamesToUpdate.forEach((game) => {
            const roundKey = `round-${game.round}`;
            const matchupKey = [game.player1, game.player2].sort().join('-');
            if (!groupedGames[roundKey]) {
                groupedGames[roundKey] = {};
            }
            if (!groupedGames[roundKey][matchupKey]) {
                groupedGames[roundKey][matchupKey] = [];
            }
            groupedGames[roundKey][matchupKey].push(game);
        });

        // Add one game per matchup in the same round
        for (const roundKey in groupedGames) {
            const matchups = groupedGames[roundKey];
            for (const matchupKey in matchups) {
                const games = matchups[matchupKey];
                const firstGame = games[0]; // Get details from an existing game in the matchup
                newGames.push({
                    player1: firstGame.player1,
                    player2: firstGame.player2,
                    scores: [], // Initialize with empty scores
                    round: firstGame.round, // Same round
                    division: firstGame.division, // Same division
                    tournamentId: firstGame.tournamentId,
                    isCrossover: firstGame.isCrossover, // Retain crossover flag
                });
            }
        }

        // Save new games to the database
        const savedGames = await Game.insertMany(newGames);

        // Update tournament games
        tournament.games.push(...savedGames.map((game) => game._id));
        await tournament.save();

        // Respond with the updated tournament details
        const updatedTournament = await Tournament.findById(tournamentId)
            .populate('divisions')
            .populate('games');
        res.status(200).json({
            message: 'Additional games added successfully to the existing round.',
            tournament: updatedTournament,
        });
    } catch (error) {
        console.error('Error adding games to existing round:', error);
        res.status(500).json({
            message: 'Failed to add games to the existing round.',
            error: error.message,
        });
    }
}


module.exports = {
    createTournament,
    getAllTournaments,
    getTournamentById,
    updateTournament,
    deleteTournament,
    getLocationTournamentCount,
    addPlayerToTournament,
    getScoresheet,
    createTournamentWithGames,
    getTournamentDetails,
    getTournamentsByLocation,
    addRound
};
