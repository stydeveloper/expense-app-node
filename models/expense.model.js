const mongoose = require('mongoose');

const Expense = mongoose.model(
    "Expense",
    new mongoose.Schema({
        role: {
            type: String,
            required: true,
            minlength: 3,
        },
        user_Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }, { timestamps: true })
);

module.exports = Expense;