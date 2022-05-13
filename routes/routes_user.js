'use strict'

const express = require('express')
const router_user = express.Router()
const Controller_user = require('../controller/controller_user')
const {is_auth} = require('../middlewares/auth')

router_user.post('/sing-up-user',Controller_user.sign_up)
router_user.post('/sing-in-user',Controller_user.sign_in)
router_user.get('/confirm-user/:token',is_auth,Controller_user.confirm)
router_user.post('/new_message',Controller_user.new_message)


module.exports=router_user