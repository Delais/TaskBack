
const nodemailer = require('nodemailer')
require('dotenv').config()


function send_email(email, mgs, Template) {

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

        const mailOptions = {
            from: process.env.USEREMAIL,
            to: email,
            subject: mgs,
            html: Template
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