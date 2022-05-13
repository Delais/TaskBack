'use strict'

const sequelize = require('../conection')
const { DataTypes } = require('sequelize')
const Model_task = require('../models/model_task')

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    user_name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email_verificado: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:'unverified'
    }
}, {
    freezeTableName: true,
    timestamps: false
})

User.hasMany(Model_task, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    foreignKey: 'id_user'
})

module.exports = User