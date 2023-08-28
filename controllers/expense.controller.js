const db = require('../models');
const Expense = db.expense;
const ExpenseDetail = db.expenseDetail;
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
// const { response } = require('express');

const getIdByHeader = (data) => {
    let userId;

    const authHeader = data?.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    jwt.verify(token, config.secret, (error, decoded) => {
        if (error) {
            return res.status(403).json({ message: "Token is not valid!" })
        };
        userId = decoded?.id;
    });
    return userId;
}

exports.addNewExpenseHandler = (req, res) => {

    const userId = getIdByHeader(req);

    let expense = new Expense({
        role: req?.body?.role,
        user_Id: userId
    });

    expense.save()
        .then(response => {
            res.status(201).json({
                success: true,
                status: 201,
                message: "Expense Role Added Successfully!",
                user_Id: userId,
                data: {
                    role: response?.role,
                    id: response?._id,
                    createdAt: response?.createdAt
                }
            });
        })
        .catch(error => {
            console.log('error :>> ', error);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error?.message,
                    status: 400
                });
            };
        });
};

exports.getExpenseDataHandler = (req, res) => {
    const userId = getIdByHeader(req);
    let count = 0;
    Expense.find({ user_Id: userId })
        .then(response => {
            if (response) {
                ExpenseDetail.find({ user_Id: userId })
                    .then(detailResponse => {
                        if (detailResponse) {
                            detailResponse.map((item) => {
                                let temp = item?.quantity * item?.rate
                                count += temp;
                            })
                            res.status(200).json({
                                success: true,
                                message: "Success",
                                status: 200,
                                data: response,
                                totalExpenseAmount: count,
                            });
                        }
                    })
                    .catch(error => {
                        return res.status(500).json({
                            success: false,
                            message: error
                        })
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

};

exports.updateExpenseDataHandler = (req, res) => {
    let id = req?.params?.id;
    if (req?.body?.role === "") {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Role field is required!"
        });
    } else if (req?.body?.role?.length < 3) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Role field atleast 3 characters!"
        });
    };
    Expense.findByIdAndUpdate(id, req?.body)
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

exports.deleteExpenseDataHandler = (req, res) => {
    let id = req?.params?.id;
    // ExpenseDetail.findByIdAndDelete(id)
    //     .then(detailResponse => {
    //         if (detailResponse) {
    //             return res.status(200).json({
    //                 success: true,
    //                 status: 200,
    //                 message: "Expense data deleted successfully!"
    //             })
    //         }
    //     })
    //     .catch(expenseDetailError => {
    //         return res.status(500).json({
    //             success: false,
    //             status: 500,
    //             message: expenseDetailError
    //         })
    //     })
    Expense.findByIdAndDelete(id)
        .then(response => {
            if (response) {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: "Expense data deleted successfully!"
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