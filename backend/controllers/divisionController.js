import { createDivision as _createDivision, getAllDivisions as _getAllDivisions, getDivisionById as _getDivisionById, updateDivision as _updateDivision, deleteDivision as _deleteDivision } from '../services/divisionService.js';

// Create a new division
async function createDivision(req, res) {
    try {
        const division = await _createDivision(req.body);
        res.status(201).json(division);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Get all divisions
async function getAllDivisions(req, res) {
    try {
        const divisions = await _getAllDivisions();
        res.status(200).json(divisions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get a division by ID
async function getDivisionById(req, res) {
    try {
        const division = await _getDivisionById(req.params.id);
        if (!division) return res.status(404).json({ message: "Division not found" });
        res.status(200).json(division);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a division by ID
async function updateDivision(req, res) {
    try {
        const division = await _updateDivision(req.params.id, req.body);
        if (!division) return res.status(404).json({ message: "Division not found" });
        res.status(200).json(division);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete a division by ID
async function deleteDivision(req, res) {
    try {
        const division = await _deleteDivision(req.params.id);
        if (!division) return res.status(404).json({ message: "Division not found" });
        res.status(200).json({ message: "Division deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default {
    createDivision,
    getAllDivisions,
    getDivisionById,
    updateDivision,
    deleteDivision
};
