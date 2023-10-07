const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
require('dotenv').config()

const app = express();

//init middleware 
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
//init db
require('./db/init.mongodb')
//init routes   
app.use('/', require('./routes'))
//handle errors
app.use((req, res, next) => {
    const error = new Error('Not Found!')
    error.status = 404;
    next(error);
})
app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: err.stack,
        message: err.message || 'Internal Server Error'
    })
})


module.exports = app;