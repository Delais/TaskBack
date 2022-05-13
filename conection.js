'use strict'
require('dotenv').config()
const Sequelize = require('sequelize')

const sequelize = new Sequelize({
    username:process.env.USERNAMEDB,
    password:process.env.PASSWORDDB,
    host:process.env.HOSTDB,
    database: process.env.DATABASE,
    dialect:process.env.DIALECT
})

module.exports = sequelize