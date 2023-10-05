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


module.exports = app;