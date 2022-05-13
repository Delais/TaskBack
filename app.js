'use strict'
require('dotenv').config()

const cookieParser = require('cookie-parser')
let express = require('express')
const morgan = require('morgan')
let app = express()
let router_task = require('./routes/routes_task')
let router_user = require('./routes/routes_user')

//middlewares
app.use(express.urlencoded({extended:false})) // lee los datos del body
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())


app.use('/api',router_task)
app.use('/api',router_user)


module.exports = app