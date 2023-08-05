const mongoose = require('mongoose');

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        userName: {
            type: String,
            required: true,
            minlength: 3,
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: false,
            minlength: 5
        },
        password: {
            type: String,
            required: true,
        },
    }, {timestamps: true})
);

module.exports = User;