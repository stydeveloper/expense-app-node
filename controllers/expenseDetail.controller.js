const db = require('../models');
const ExpenseDetail = db.expenseDetail;
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config')

const getIdByHeader = (data) => {
    let userId;

    const authHeader = data?.headers?.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    jwt.verify(token, config.secret, (error, decoded) => {
        if (error) {
            return res.status(403).json({ message: "Token is not valid!" });
        };
        userId = decoded?.id;
    });
    return userId;
};

exports.getExpenseDetailData = (req, res) => {
    const userId = getIdByHeader(req);
    const expenseId = req?.params?.id;
    ExpenseDetail.find({ expense_Id: expenseId })
    // ExpenseDetail.findById({ user_Id: userId })
        .then(response => {
            console.log('response', response);
            if (response) {
                res.status(200).json({
                    success: true,
                    message: "Success",
                    status: 200,
                    data: response
                });
            };
        })
        .catch(error => {
            if (error) {
                res.status(500).json({
                    success: false,
                    message: error,
                    status: 500
                });
            };
        });
}

exports.addNewExpenseDetail = (req, res) => {
    const userId = getIdByHeader(req);
    const expenseId = req?.params?.id;

    let expenseDetailData = new ExpenseDetail({
        productname: req?.body?.productname,
        quantity: req?.body?.quantity,
        rate: req?.body?.rate,
        expense_Id: expenseId,
        user_Id: userId
    });

    expenseDetailData.save()
        .then(response => {
            console.log('response :>> ', response);
            if (response) {
                return res.status(201).json({
                    success: true,
                    status: 201,
                    message: "Expense detail added successfully!",
                    user_Id: userId,
                    expense_Id: expenseId,
                    data: response
                });
            };
        })
        .catch(error => {
            console.log('error :>> ', error);
            if (error) {
                return res.status(400).json({
                    message: error?.message,
                    success: false,
                    status: 400
                });
            };
        });
};

exports.updateExpenseDetailData = (req, res) => {
    let id = req?.params?.id;
    console.log('req?.body', req?.body);

    if (req?.body?.productname === "") {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Product name is required."
        });
    } else if (req?.body?.productname?.length < 3) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Product name atleast 3 characters long."
        });
    } else if (req?.body?.quantity < 1) {
        console.log("Working");
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Quantity atleast 1."
        });
    } else if (req?.body?.rate === 0) {
        console.log("Working");
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Rate is greater than 0."
        });
    };

    ExpenseDetail.findByIdAndUpdate(id, req?.body)
        .then(response => {
            if (response) {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: "Expense data updated successfully!"
                });
            };
        })
        .catch(error => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    status: 500,
                    message: error
                });
            };
        });
};

exports.deleteExpenseDetailData = (req, res) => {
    let id = req?.params?.id;
    ExpenseDetail.findByIdAndDelete(id)
        .then(response => {
            if (response) {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: "Data deleted successfully!"
                })
            }
        })
        .catch(error => {
            if (error) {
                return res.status(500), json({
                    success: false,
                    status: 500,
                    message: error
                });
            };
        });
};