const db = require('../models');
const User = db.user;
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const bcrypt = require('bcryptjs');

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
};

exports.getProfileDataHandler = (req, res) => {
    const userId = getIdByHeader(req);
    User.findById(userId)
        .then(response => {
            console.log('response :>> ', response);
            return res.status(200).json({
                success: true,
                status: 200,
                data: response,
                message: "Success"
            })
        })
        .catch(error => {
            return res.status(500).json({
                success: false,
                message: error,
                status: 500
            });
        })
};

exports.updateUserProfileHandler = (req, res) => {
    const userId = getIdByHeader(req);
    let id = req?.params?.id;
    User.findOne({ _id: userId })
        .then(user => {
            console.log('user :>> ', user);
            if (!user) {
                return res.status(400).json({
                    success: false,
                    status: 404,
                    message: "No user found."
                });
            };
            user.userName = req?.body?.userName;
            user.email = req?.body?.email;
            user.phone = req?.body?.phone;
            
            if (req?.body?.password.length > 1 && req?.body?.password.length < 8) {
                return res.status(400).json({
                    success: false,
                    status: 400,
                    message: "Password must be at least 8 characters long."
                })
            } else if (req?.body?.password.length >= 8) {
                user.password = bcrypt.hashSync(req?.body?.password, 8);
            } else {
                user.password = user.password;
            }
            // user.password = bcrypt.hashSync(req?.body?.password, 8);
            console.log('Updated user :>> ', user);
            user.save()
                .then(response => {
                    return res.status(200).json({
                        success: true,
                        status: 200,
                        message: "Profile updated successfully!",
                    })
                })
                .catch(error => {
                    return res.status(500).json({
                        success: false,
                        status: 500,
                        message: error
                    })
                })
        })
        .catch(error => {
            return res.status(500).json({
                success: false,
                status: 500,
                message: error
            })
        })
}