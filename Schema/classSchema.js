var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var classSchema = new mongoose.Schema({
    routineFor: { 
        ref: 'Program', 
        type: mongoose.Schema.ObjectId 
    },
    subject: { 
        ref: 'Subject',
        type: mongoose.Schema.ObjectId, 
    },
    teacherName: [{ 
        ref: 'Teacher', 
        type: mongoose.Schema.ObjectId 
    }],
    classType: { 
        type: String, 
        required: false 
    },
    classGroup: { 
        type: String, 
        required: false 
    },
    startingPeriod: { 
        type: Number, 
        required: false 
    },
    noOfPeriod: { 
        type: Number, 
        required: false 
    },
    courseCode: { 
        type: String, 
        required: false 
    },
    link1: { 
        type: String, 
        required: false 
    },
    weekDay: {
        type: String, enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
            'Friday'], required: false
    },
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);