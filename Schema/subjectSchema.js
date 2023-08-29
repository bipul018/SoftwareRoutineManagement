const mongoose = require('mongoose');

var SubjectSchema = new mongoose.Schema({
    subjectName:{
        type: String,
        required: true
    },
    subjectCode: {
        type: String,
        required: false
    }
},{timestamps: true})


module.exports = mongoose.model('Subject', SubjectSchema);