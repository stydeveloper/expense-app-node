require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
const authRoutes = require('./routes/auth.routes');
const expenseRoutes = require('./routes/expense.route');
const expenseDetailRoutes = require('./routes/expenseDetail.route');
const userProfileRoutes = require('./routes/user.route');

app.use('/api/auth', authRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/expense-detail', expenseDetailRoutes);
app.use('/api/user', userProfileRoutes);

console.log('MONGODB_URL ', process.env.MONGODB_URL)

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Connect to Database"))
    .catch(error => console.log(error));

app.listen(PORT, () => {
    console.log(`Expense server is running on PORT: http://localhost:${PORT}`);
})