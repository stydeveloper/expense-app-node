const controller = require('../controllers/user.controller');
const express = require('express');
const router = express.Router();
const {headerJwt} = require('../middlewares');

router.get('/', [headerJwt.verifyToken], controller.getProfileDataHandler);
module.exports = router;