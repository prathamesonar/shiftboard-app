const mongoose = require('mongoose');

const shiftSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, 
    startTime: { type: String, required: true }, 
    endTime: { type: String, required: true }   
}, { timestamps: true });

module.exports = mongoose.model('Shift', shiftSchema);