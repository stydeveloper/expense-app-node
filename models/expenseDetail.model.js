const mongoose = require('mongoose');

const ExpenseDetail = mongoose.model(
    "ExpenseDetail",
    new mongoose.Schema({
        productname: {
            type: String,
            required: true,
            minlength: 3,
        },
        quantity: {
            type: Number,
            required: false
        },
        rate: {
            type: Number,
            required: true
        },
        expense_Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Expense"
        },
        user_Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }, { timestamps: true })
);

module.exports = ExpenseDetail;