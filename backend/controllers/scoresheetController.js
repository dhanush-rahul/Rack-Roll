import { createScoresheet as _createScoresheet, getAllScoresheets as _getAllScoresheets, getScoresheetById as _getScoresheetById, updateScoresheet as _updateScoresheet, deleteScoresheet as _deleteScoresheet } from '../services/scoresheetService.js';

async function createScoresheet(req, res) {
    try {
        const scoresheet = await _createScoresheet(req.body);
        res.status(201).json(scoresheet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getAllScoresheets(req, res) {
    try {
        const scoresheets = await _getAllScoresheets();
        res.status(200).json(scoresheets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getScoresheetById(req, res) {
    try {
        const scoresheet = await _getScoresheetById(req.params.id);
        if (!scoresheet) return res.status(404).json({ message: "Scoresheet not found" });
        res.status(200).json(scoresheet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateScoresheet(req, res) {
    try {
        const scoresheet = await _updateScoresheet(req.params.id, req.body);
        if (!scoresheet) return res.status(404).json({ message: "Scoresheet not found" });
        res.status(200).json(scoresheet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function deleteScoresheet(req, res) {
    try {
        const scoresheet = await _deleteScoresheet(req.params.id);
        if (!scoresheet) return res.status(404).json({ message: "Scoresheet not found" });
        res.status(200).json({ message: "Scoresheet deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default {
    createScoresheet,
    getAllScoresheets,
    getScoresheetById,
    updateScoresheet,
    deleteScoresheet
};
