const controller = require('../controllers/expense.controller');
const express = require('express');
const router = express.Router();
const { headerJwt } = require('../middlewares');

router.post("/add", [headerJwt.verifyToken], controller.addNewExpenseHandler);
router.get('/', [headerJwt.verifyToken], controller.getExpenseDataHandler);

// Pass expense id in params
router.put('/update/:id', [headerJwt.verifyToken], controller.updateExpenseDataHandler);

// Pass expense id in params
router.put('/delete/:id', [headerJwt.verifyToken], controller.deleteExpenseDataHandler);

module.exports = router;