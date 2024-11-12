const Scoresheet = require('../models/Scoresheet');

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

module.exports = {
    createScoresheet,
    getAllScoresheets,
    getScoresheetById,
    updateScoresheet,
    deleteScoresheet
};
