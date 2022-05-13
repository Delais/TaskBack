'use strict'

const sequelize = require('../conection') 
const {DataTypes} = require('sequelize')


const Task = sequelize.define('Task',{
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement:true,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING(20),
        allowNull: false
    },
    description:{
        type: DataTypes.TEXT,
        allowNull:false
    }
},{
    freezeTableName:true,
    timestamps:false
})

module.exports = Task