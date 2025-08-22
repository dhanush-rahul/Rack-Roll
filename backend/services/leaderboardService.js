const Leaderboard = require('../models/Leaderboard').default;

async function createLeaderboard(data) {
    const leaderboard = new Leaderboard(data);
    return await leaderboard.save();
}

async function getAllLeaderboards() {
    return await Leaderboard.find().populate('division');
}
async function getLeaderboard(tournamentId, divisionId){
    return await Leaderboard.findOne({tournamentId, division: divisionId });
}

async function getLeaderboardById(id) {
    return await Leaderboard.findById(id).populate('division');
}

async function updateLeaderboard(id, updateData) {
    return await Leaderboard.findByIdAndUpdate(id, updateData, { new: true });
}

async function deleteLeaderboard(id) {
    return await Leaderboard.findByIdAndDelete(id);
}

module.exports = {
    createLeaderboard,
    getAllLeaderboards,
    getLeaderboardById,
    updateLeaderboard,
    deleteLeaderboard,
    getLeaderboard
};
