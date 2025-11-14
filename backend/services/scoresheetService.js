import Scoresheet from '../models/Scoresheet.js';

async function createScoresheet(data) {
    const scoresheet = new Scoresheet(data);
    return await scoresheet.save();
}

async function getAllScoresheets() {
    return await Scoresheet.find().populate('games').populate('division');
}

async function getScoresheetById(id) {
    return await Scoresheet.findById(id).populate('games').populate('division');
}

async function updateScoresheet(id, updateData) {
    return await Scoresheet.findByIdAndUpdate(id, updateData, { new: true });
}

async function deleteScoresheet(id) {
    return await Scoresheet.findByIdAndDelete(id);
}

export default {
    createScoresheet,
    getAllScoresheets,
    getScoresheetById,
    updateScoresheet,
    deleteScoresheet
};

// Also provide named exports
export {
    createScoresheet,
    getAllScoresheets,
    getScoresheetById,
    updateScoresheet,
    deleteScoresheet
};
