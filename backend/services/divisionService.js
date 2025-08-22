const Division = require('../models/Division').default;

// Create a new division
async function createDivision(divisionData) {
    const division = new Division(divisionData);
    return await division.save();
}

// Get all divisions
async function getAllDivisions() {
    return await Division.find().populate('players').populate('games');
}

// Get a specific division by ID
async function getDivisionById(id) {
    return await Division.findById(id).populate('players').populate('games');
}

// Update a division by ID
async function updateDivision(id, updateData) {
    return await Division.findByIdAndUpdate(id, updateData, { new: true });
}

// Delete a division by ID
async function deleteDivision(id) {
    return await Division.findByIdAndDelete(id);
}

module.exports = {
    createDivision,
    getAllDivisions,
    getDivisionById,
    updateDivision,
    deleteDivision
};
