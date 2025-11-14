import Division from '../models/Division.js';

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

export default {
    createDivision,
    getAllDivisions,
    getDivisionById,
    updateDivision,
    deleteDivision
};

// Also provide named exports for convenience
export {
    createDivision,
    getAllDivisions,
    getDivisionById,
    updateDivision,
    deleteDivision
};
