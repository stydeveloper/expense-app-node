const express = require('express');
const controller = require('../controllers/expenseDetail.controller');
const { headerJwt } = require('../middlewares');
const router = express.Router();

// Pass expense id in params
router.get('/:id', [headerJwt.verifyToken], controller.getExpenseDetailData);

// Pass expense id in params
router.post('/add/:id', [headerJwt.verifyToken], controller.addNewExpenseDetail);

// Pass Expense Detail id in params
router.put('/update/:id', [headerJwt.verifyToken], controller.updateExpenseDetailData);

// Pass Expense Detail id in params
router.put('/delete/:id', [headerJwt.verifyToken], controller.deleteExpenseDetailData);

module.exports = router;