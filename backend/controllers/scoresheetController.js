const scoresheetService = require('../services/scoresheetService');

async function createScoresheet(req, res) {
    try {
        const scoresheet = await scoresheetService.createScoresheet(req.body);
        res.status(201).json(scoresheet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getAllScoresheets(req, res) {
    try {
        const scoresheets = await scoresheetService.getAllScoresheets();
        res.status(200).json(scoresheets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getScoresheetById(req, res) {
    try {
        const scoresheet = await scoresheetService.getScoresheetById(req.params.id);
        if (!scoresheet) return res.status(404).json({ message: "Scoresheet not found" });
        res.status(200).json(scoresheet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateScoresheet(req, res) {
    try {
        const scoresheet = await scoresheetService.updateScoresheet(req.params.id, req.body);
        if (!scoresheet) return res.status(404).json({ message: "Scoresheet not found" });
        res.status(200).json(scoresheet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function deleteScoresheet(req, res) {
    try {
        const scoresheet = await scoresheetService.deleteScoresheet(req.params.id);
        if (!scoresheet) return res.status(404).json({ message: "Scoresheet not found" });
        res.status(200).json({ message: "Scoresheet deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createScoresheet,
    getAllScoresheets,
    getScoresheetById,
    updateScoresheet,
    deleteScoresheet
};
