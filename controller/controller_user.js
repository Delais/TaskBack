'use strict'

const Model_user = require('../models/model_user')
const bcrypt = require('bcryptjs')
const { generarToken } = require('../config/token.config')
const { send_email } = require('../config/email.config')
const { v4: uuidv4 } = require('uuid');

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

            const token = generarToken({
                email
            }, '5min')
            const urlconfirm = `http://localhost:4000/api/confirm-user/${token}`

            const TemplateConfirm = `
            <h1>Hola ${name} como estas este es un correo automatico </h1>
            <p>Para confirmar tu cuenta y poder utilizar nuestra has click en el siguiente Enlace</p>
            <p>Este enlace solo tiene 5 minutos de validez despues se desabilitara</p>
            <a href=${urlconfirm}>Confirmar</a>
            `


            send_email(email, 'Verifica Tu correo', TemplateConfirm)

            return res.status(201).json(
                {
                    msg: 'Usuario Registrado',
                    status: 'Suscess',
                    New_user,
                    token
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
            const code = uuidv4()
            const Token = generarToken({
                id: Userfound.id,
                name: Userfound.name,
                email: Userfound.email,
                user_name: Userfound.user_name,
                code
            }, '2h')

            const TemplateConfirm = `
            <h1>Hola ${Userfound.name} como estas este es un correo automatico </h1>
            <p>Para acceder tu cuenta y poder utilizar nuestra has inserta el sigiente codigo en la formulario de acceso</p>
            <p>Este enlace solo tiene 5 minutos de validez despues se desabilitara</p>
            <h2>${code}</h2>
            `
            send_email(Userfound.email, 'Verifica Tu Acceso', TemplateConfirm)

            return res.status(200).json({
                msg: 'Usuario Y Password correctos',
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

    authenticate_access: async(req,res) => {
        try {
            const Payload = req.payload
            const { code,name, email } = Payload
            const {code_user} = req.body

            if(!code_user){
                return res.status(401).json(
                    {
                        msg: 'Debe llenar todos los datos',
                        status: 'Fallido'
                    }
                )
            }

            if(code != code_user){
                return res.status(203).json(
                    {
                        msg: 'Los codigos de acceso no conciden',
                        status: 'Fallido'
                    }
                )
            }

            const TemplateConfirm = `
            <h1>Hola ${name} como estas este es un correo automatico </h1>
            <p>Inicio De seccion exitoso</p>
            `
            send_email(email, 'Inicio De Seccion', TemplateConfirm)

            return res.status(200).json({
                msg: 'Bienvenido',
                status: 'Suscess',
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

            if(!email){
                res.status(400).json(
                    {
                        msg: 'El correo electronico es requerido',
                        status: 'Fallido'
                    }
                )
            }

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

            const token = generarToken({
                email
            }, '5min')
            const urlconfirm = `http://localhost:4000/api/confirm-user/${token}`

            const TemplateConfirm = `
            <h1>Hola ${Userfound.name} como estas este es un correo automatico </h1>
            <p>Para confirmar tu cuenta y poder utilizar nuestra has click en el siguiente Enlace</p>
            <p>Este enlace solo tiene 5 minutos de validez despues se desabilitara</p>
            <a href=${urlconfirm}>Confirmar</a>`

            send_email(email, 'Verifica Tu correo',TemplateConfirm)

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
    },

    S_change_password: async (req, res) => {
        try {
            const { email } = req.body

            if (!email) {
                res.status(400).json(
                    {
                        msg: 'El correo electronico es requerido',
                        status: 'Fallido'
                    }
                )
            }

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

            const token = generarToken({
                email: Userfound.email,
                password: Userfound.password,
                name:Userfound.name
            }, '3min')
            const urlconfirm = `http://localhost:4000/api/change_password/${token}`

            const TemplateConfirm = `
            <h1>Hola ${Userfound.name} como estas este es un correo automatico </h1>
            <p>Para Cambiar tu contraseña de acceso has click en el sigiente enlace</p>
            <p>Este enlace solo tiene 3 minutos de validez despues se desabilitara</p>
            <a href=${urlconfirm}>Confirmar</a>`

            send_email(email, 'Solisitud de cambio de contraseña', TemplateConfirm)

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
    },

    change_password: async (req, res) => {
        try {
            const { old_password, new_password } = req.body

            if (!old_password && new_password) {
                res.status(400).json(
                    {
                        msg: 'Debe insertar todos los datos requeridos',
                        status: 'Fallido'
                    }
                )
            }

            const Payload = req.payload
            const { email, password ,name} = Payload
            console.log(email, password)
            const ispassword = bcrypt.compareSync(old_password, password)

            if (!ispassword) {
                return res.status(401).json(
                    {
                        msg: 'Contraseña Incorrecta',
                        status: 'Fallido'
                    }
                )
            }

            let hash = bcrypt.hashSync(new_password, 10)

            const dataUser = await Model_user.update(
                {
                    password: hash
                }, {
                where: {
                    email
                }
            })

            if (dataUser == 0) {
                return res.status(404).json(
                    {
                        msg: "No se cambiar la contraseña",
                        status: 'Fallido'
                    }
                )
            }

            const TemplateConfirm = `
            <h1>Hola ${name} como estas este es un correo automatico </h1>
            <p>Contraseña Cambiada con exitoso</p>
            `
            send_email(email, 'Contraseña Cambiada', TemplateConfirm)

            return res.status(201).json(
                {
                    msg: "Contraseña Cambiada",
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


module.exports = Controller_user