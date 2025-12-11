const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    employeeCode: { type: String },
    department: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);