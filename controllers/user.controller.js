const db = require('../models');
const User = db.user;
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

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
}