const Division = require('../models/Division').default;
const Player = require('../models/Player').default;

async function createPlayer(data) {
    const player = new Player(data);
    return await player.save();
}

async function getAllPlayers() {
    return await Player.find();
}

async function getPlayerById(id) {
    return await Player.findById(id);
}

async function updatePlayer(id, updateData) {
    return await Player.findByIdAndUpdate(id, updateData, { new: true });
}

async function deletePlayer(id) {
    return await Player.findByIdAndDelete(id);
}
async function getPlayerDivision(playerId, tournamentId) {
    const division = await Division.findOne({
        players: playerId,
        tournamentId: tournamentId,
    }).select("_id");

    return division ? division._id : null;
}
module.exports = {
    createPlayer,
    getAllPlayers,
    getPlayerById,
    updatePlayer,
    deletePlayer,
    getPlayerDivision
};
