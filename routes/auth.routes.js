const controller = require('../controllers/auth.controller');
const express = require('express');
const router = express.Router();

router.post('/signup', controller.signup);
router.post('/signin', controller.signin);
router.post('/forgot', controller.forgotPassword);

module.exports = router;