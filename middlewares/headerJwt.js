const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

verifyToken = (req, res, next) => {
    function getToken(item) {
        if (item?.headers?.authorization && item?.headers?.authorization.split(" ")[0] === "Bearer") {
            return item?.headers?.authorization.split(" ")[1]
        };
        return null;
    }
    let token = getToken(req);

    if (!token) {
        return res.status(403).json({ message: "No token provided!" })
    };

    jwt.verify(token, config.secret, (error, decoded) => {
        if (error) {
            return res.status(403).json({ message: "Unauthorized!" });
        };
        req.userId = decoded?.id;
        next();
    })
};

const headerJwt = {
    verifyToken
};

module.exports = headerJwt;