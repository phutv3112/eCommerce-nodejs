'use strict'

const mongoose = require('mongoose')
const connectString = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

class Database {
    constructor() {
        this.connect()
    }
    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true })
        }
        mongoose.connect(connectString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4,
        }).then(_ => console.log('Connect to mongodb successfully!'))
            .catch(err => console.log('Error connecting to mongodb::', err))
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}
const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb