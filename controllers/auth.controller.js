const db = require('../models');
const User = db.user;
const bcrypt = require('bcryptjs');
const jwtToken = require('jsonwebtoken');
const config = require('../config/auth.config');
const { response } = require('express');

exports.signup = (req, res) => {

    User.findOne({ email: req?.body?.email })
        .then(user => {
            if (user) {
                return res.status(400).send({
                    success: false,
                    message: "Failed! Email is already in use!",
                    status: 400
                });
            } else {
                const user = new User({
                    userName: req?.body?.userName,
                    email: req?.body?.email,
                    phone: req?.body?.phone,
                    password: bcrypt.hashSync(req?.body?.password, 8)
                });

                user.save()
                    .then(user => {
                        if (!user) {
                            res.status(203).send({ message: "Please try again!" });
                        } else {
                            res?.status(201).json({
                                success: true,
                                message: "User register successfully!",
                                data: user,
                                status: 201
                            })
                        }
                    })
                    .catch(error => {
                        res.status(500).send({ message: error })
                    });
            }
        })
        .catch(error => {
            if (error) {
                return res.status(500).send({ message: error })
            }
        });
};

exports.signin = (req, res) => {
    User.findOne({ email: req?.body?.email })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: "No account with the supplied email exists!",
                    status: 404
                });
            };
            let passwordisValid = bcrypt.compareSync(req?.body?.password, user?.password);
            if (!passwordisValid) {
                return res?.status(401).send({
                    success: false,
                    message: "Invalid password!",
                    status: 401
                });
            } else {
                const token = jwtToken.sign({ id: user?.id }, config?.secret, {
                    algorithm: 'HS256',
                    allowInsecureKeySizes: true,
                    expiresIn: 604800, // 1 Week
                });
                res?.status(200).json({
                    success: true,
                    user_Id: user?._id,
                    userName: user?.userName,
                    email: user?.email,
                    phone: user?.phone,
                    authToken: token,
                    message: "Logged In successfully!",
                    status: 200
                })
            }
        })
        .catch(error => {
            if (error) {
                res.status(500).send({ message: error })
            }
        });
};

exports.forgotPassword = (req, res) => {
    User.findOne({ email: req?.body?.email })
        .then(user => {
            console.log('user :>> ', user);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "No account with the supplied email exists!",
                    status: 404,
                })
            };
            user.password = bcrypt.hashSync(req.body.password, 8)
            user.save()
                .then(response => {
                    console.log('response :>> ', response);
                    res.status(200).json({
                        success: true,
                        message: "Password Updated successfully!",
                        status: 200,
                    });
                })
                .catch(error => {
                    console.log('erroror :>> ', error);
                    if (error) {
                        res.status(500).json({ message: error });
                    };
                });
        })
        .catch(error => {
            if (error) {
                return res.status(500).json({ message: error });
            };
        });
};