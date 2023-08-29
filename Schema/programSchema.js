var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var programSchema = new mongoose.Schema({
    programName: { type: String, required: true },
    year: { type: Number, required: true },
    part: { type: String, required: true },
    section: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Program', programSchema);