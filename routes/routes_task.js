'use strict'

const express = require('express')
const Router_task = express.Router()
const Controller_task = require('../controller/controller_task')
const {is_auth} = require('../middlewares/auth')

Router_task.get('/home-task',is_auth, Controller_task.view)
Router_task.post('/new-task',is_auth,Controller_task.new)
Router_task.put('/update-task/:id',is_auth, Controller_task.update)
Router_task.delete('/delite-task/:id',is_auth,Controller_task.delite)


module.exports=Router_task