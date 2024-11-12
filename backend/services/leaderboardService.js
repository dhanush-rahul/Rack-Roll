const Leaderboard = require('../models/Leaderboard');

async function createLeaderboard(data) {
    const leaderboard = new Leaderboard(data);
    return await leaderboard.save();
}

async function getAllLeaderboards() {
    return await Leaderboard.find().populate('division');
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
    deleteLeaderboard
};
