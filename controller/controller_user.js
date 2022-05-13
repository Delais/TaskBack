'use strict'

const Model_user = require('../models/model_user')
const bcrypt = require('bcryptjs')
const { generarToken } = require('../config/token.config')
const { send_email } = require('../config/email.config')
const res = require('express/lib/response')

let Controller_user = {
    sign_up: async (req, res) => {


        try {
            const { id, name, lastname, email, user_name, password } = req.body

            const Userfound = await Model_user.findOne({
                where: {
                    email
                }
            })

            if (Userfound) {
                return res.status(400).json({
                    msg: 'El Usuario ya existe',
                    status: 'Fallido'
                })
            }

            let hash = bcrypt.hashSync(password, 10)
            const New_user = await Model_user.create({
                id,
                name,
                lastname,
                email,
                user_name,
                password: hash
            })
            if (!New_user) {
                return res.status(500).json(
                    {
                        msg: 'No se creo el usuario',
                        status: 'Fallido'
                    }
                )
            }

            send_email(email, 'Verifica Tu correo')

            return res.status(201).json(
                {
                    msg: 'Usuario Registrado',
                    status: 'Suscess',
                    New_user
                }
            )
        } catch (error) {
            return res.status(500).json(
                {
                    msg: 'error interno del servidor',
                    status: 'error',
                    error
                }
            )
        }
    },

    sign_in: async (req, res) => {

        try {
            const { email, password } = req.body

            const Userfound = await Model_user.findOne(
                {
                    where: {
                        email
                    }
                }
            )
            if (!Userfound) {
                return res.status(404).json(
                    {
                        msg: 'El Usuario o Contraseña Incorrecta',
                        status: 'Fallido'
                    }
                )
            }

            const ispassword = bcrypt.compareSync(password, Userfound.password)
            if (!ispassword) {
                return res.status(401).json(
                    {
                        msg: 'El Usuario o Contraseña Incorrecta',
                        status: 'Fallido'
                    }
                )
            }

            if (Userfound.email_verificado == 'unverified') {
                return res.status(203).json(
                    {
                        msg: 'El Usuario no esta confirmado',
                        status: 'Fallido'
                    }
                )
            }

            const Token = generarToken({
                id: Userfound.id,
                name: Userfound.name,
                email: Userfound.email,
                user_name: Userfound.user_name
            }, '2h')

            return res.status(200).json({
                msg: 'Bienvenido',
                status: 'Suscess',
                Token
            })


        } catch (error) {
            return res.status(500).json({
                msg: 'Error interno del servidor',
                status: 'Error',
                error
            })
        }

    },
    confirm: async (req, res) => {
        try {
            const Payload = req.payload
            const { email } = Payload
            const UpadateUser = await Model_user.update(
                {
                    email_verificado: 'verified'
                }, {
                where: {
                    email
                }
            })
            if (UpadateUser == 0) {
                return res.status(404).json(
                    {
                        msg: "No se pudo confirmar el usuario",
                        status: 'Fallido'
                    }
                )
            }
            return res.status(201).json(
                {
                    msg: "Usuario Confirmado",
                    status: 'Suscess',
                    UpadateUser
                }
            )

        } catch (error) {
            return res.status(500).json({
                msg: 'Error interno del servidor',
                status: 'Error',
                error
            })
        }
    },

    new_message: async (req, res) => {
        try {
            const { email } = req.body

            const Userfound = await Model_user.findOne(
                {
                    where: {
                        email
                    }
                })

            if (!Userfound) {
                return res.status(404).json(
                    {
                        msg: 'El Usuario no existe',
                        status: 'Fallido'
                    }
                )
            }
            
            if (Userfound.email_verificado == 'verified') {
                return res.status(203).json(
                    {
                        msg: 'El Usuario ya esta confirmado',
                        status: 'Fallido'
                    }
                )
            }

            send_email(email, 'Verifica Tu correo')

            return res.status(201).json(
                {
                    msg: "correo enviado",
                    status: 'Suscess'
                }
            )

        } catch (error) {
            return res.status(500).json({
                msg: 'Error interno del servidor',
                status: 'Error',
                error
            })
        }
    }

}

async function RegistrarUsuario() {

}

module.exports = Controller_user