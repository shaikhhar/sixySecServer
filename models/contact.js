const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    FirstName: String,
    LastName: String,
    PhoneNumber: String,
    Email: { type: String, required: true, unique: true, lowercase: true },
    Password: String,
    Role: String,
    ReportsTo: String,
    created_at: Date
});

module.exports = mongoose.model('Contact', userSchema);