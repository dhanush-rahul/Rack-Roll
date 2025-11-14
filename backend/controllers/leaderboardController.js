import { createLeaderboard as _createLeaderboard, getAllLeaderboards as _getAllLeaderboards, getLeaderboard as _getLeaderboard, updateLeaderboard as _updateLeaderboard, deleteLeaderboard as _deleteLeaderboard } from '../services/leaderboardService.js';

async function createLeaderboard(req, res) {
    try {
        const leaderboard = await _createLeaderboard(req.body);
        res.status(201).json(leaderboard);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getAllLeaderboards(req, res) {
    try {
        const leaderboards = await _getAllLeaderboards();
        res.status(200).json(leaderboards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getLeaderboard = async (req, res) => {
    const { tournamentId, divisionId } = req.params;
    try {
      const leaderboard = await _getLeaderboard(tournamentId, divisionId);
      if (!leaderboard) {
        return res.status(404).json({ message: 'Leaderboard not found' });
      }
  
      res.status(200).json(leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

async function updateLeaderboard(req, res) {
    try {
        const leaderboard = await _updateLeaderboard(req.params.id, req.body);
        if (!leaderboard) return res.status(404).json({ message: "Leaderboard not found" });
        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function deleteLeaderboard(req, res) {
    try {
        const leaderboard = await _deleteLeaderboard(req.params.id);
        if (!leaderboard) return res.status(404).json({ message: "Leaderboard not found" });
        res.status(200).json({ message: "Leaderboard deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default {
    createLeaderboard,
    getAllLeaderboards,
    getLeaderboard,
    updateLeaderboard,
    deleteLeaderboard
};
