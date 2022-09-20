require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const dbConnect = require('./utils/dbConnect');
const userRouter = require('./routes/userRoutes');
const frontEndRouter = require('./routes/frontendRoutes');
const path = require('path');

const app = express();
const PORT = 3000;

dbConnect();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(morgan('dev'));
app.use('/users/api', userRouter);
app.use('/', frontEndRouter);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
