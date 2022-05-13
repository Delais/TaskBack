
const nodemailer = require('nodemailer')
require('dotenv').config()
const {generarToken} = require('../config/token.config')

function send_email(email, mgs) {

    try {
        console.log(process.env.USER)
        console.log(process.env.PASS)
        const transporter = nodemailer.createTransport(
            {
                service: process.env.SERVICE,
                host: process.env.HOST,
                auth: {
                    
                    user:process.env.USEREMAIL,
                    pass:process.env.PASS
                }
            }
        )

        const token = generarToken({
            email
        },'1h')
        const urlconfirm = `http://localhost:4000/api/confirm-user/${token}`

        const mailOptions = {
            from: 'desarrollocarlosydelais@gmail.com',
            to: email,
            subject: mgs,
            html: `<a href=${urlconfirm}>Confirmar</a>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {

    }


}

module.exports = { send_email }