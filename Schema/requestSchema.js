const mongoose =  require("mongoose");

var requestSchema = new mongoose.Schema({
    teacher: { 
        ref: "Teacher", 
        type: mongoose.Schema.ObjectId, 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    username: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'success', 'rejected'], 
        default: 'pending' 
    },
    parent: { 
        ref: "User", 
        type: mongoose.Schema.ObjectId, 
        required: true 
    },
    deleted: { 
        type: Boolean, 
        default: false 
    },
}, { timestamps: true });

var Request = mongoose.model('Request', requestSchema);

// export default Request;
module.exports = Request;