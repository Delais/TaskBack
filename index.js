'use strict'

let express = require('express')
const app = require('./app')
let port = process.env.port || 4000
const sequelize = require('./conection')

async function probarConection(){
    try {
        await sequelize.authenticate()
        console.log("conection exitosa")
    } catch (error) {
        console.log('error ', error)
    }
}


app.listen(port, async()=>{
    try {
        await sequelize.sync()
        console.log('server corriendo en el puerto ', port)
    } catch (error) {
        console.error('No se crearon lso tablas en la bd')
    }
})

