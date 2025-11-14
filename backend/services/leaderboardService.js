import Leaderboard from '../models/Leaderboard.js';

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

export default {
    createLeaderboard,
    getAllLeaderboards,
    getLeaderboardById,
    updateLeaderboard,
    deleteLeaderboard,
    getLeaderboard
};

// Also provide named exports
export {
    createLeaderboard,
    getAllLeaderboards,
    getLeaderboardById,
    updateLeaderboard,
    deleteLeaderboard,
    getLeaderboard
};
