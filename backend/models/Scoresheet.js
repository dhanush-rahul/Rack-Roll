const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoresheetSchema = new Schema({
    games: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
    division: { type: Schema.Types.ObjectId, ref: 'Division', required: true },
    generated_timestamp: { type: Date, default: Date.now },
    ranking: { type: Map, of: Number }  // {Player ID: Rank}
});

// Scoresheet Methods
scoresheetSchema.methods.generatePDF = function() {
    // PDF generation logic
};

scoresheetSchema.methods.generateImage = function() {
    // Image generation logic
};

scoresheetSchema.methods.saveToCloud = function() {
    // Cloud storage logic (e.g., AWS S3 upload)
};

module.exports = mongoose.model('Scoresheet', scoresheetSchema);
