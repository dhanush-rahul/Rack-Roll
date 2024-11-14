const leaderboardService = require('../services/leaderboardService');

async function createLeaderboard(req, res) {
    try {
        const leaderboard = await leaderboardService.createLeaderboard(req.body);
        res.status(201).json(leaderboard);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getAllLeaderboards(req, res) {
    try {
        const leaderboards = await leaderboardService.getAllLeaderboards();
        res.status(200).json(leaderboards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getLeaderboardById(req, res) {
    try {
        const leaderboard = await leaderboardService.getLeaderboardById(req.params.id);
        if (!leaderboard) return res.status(404).json({ message: "Leaderboard not found" });
        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateLeaderboard(req, res) {
    try {
        const leaderboard = await leaderboardService.updateLeaderboard(req.params.id, req.body);
        if (!leaderboard) return res.status(404).json({ message: "Leaderboard not found" });
        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function deleteLeaderboard(req, res) {
    try {
        const leaderboard = await leaderboardService.deleteLeaderboard(req.params.id);
        if (!leaderboard) return res.status(404).json({ message: "Leaderboard not found" });
        res.status(200).json({ message: "Leaderboard deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createLeaderboard,
    getAllLeaderboards,
    getLeaderboardById,
    updateLeaderboard,
    deleteLeaderboard
};