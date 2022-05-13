'use strict'
const Model_Task = require('../models/model_task')

let Controller_task = {
    view: async (req, res) => {
        try {
            const Payload = req.payload
            const { id } = Payload
            const leerTask = await Model_Task.findAll({
                where: {
                    id_user: id
                }
            })
            if (!leerTask.length) {
                return res.status(404).json(
                    {
                        msg: 'No se encontraron tareas con esta id',
                        status: 'Fallido'
                    }
                )
            } else {
                return res.status(200).json(
                    {
                        msg: 'Tareas Encontardas',
                        status: 'Suscess',
                        leerTask,
                        Payload
                    }
                )
            }
        } catch (error) {
            return res.status(500).json(
                {
                    msg: 'error',
                    status: 'error',
                    error
                }
            )
        };
    },
    new: async (req, res) => {
        const { name, description } = req.body
        const Payload = req.payload
        const { id } = Payload
        try {
            //Model_Task.sync()
            const NewTask = await Model_Task.create({
                name: name,
                description: description,
                id_user: id
            })
            if(!NewTask){
                return res.status(400).json(
                    {
                        msg:'No se pudo guardar la tarea',
                        status:'Fallido'
                    }
                )
            }
            return res.status(201).json(
                {
                    msg:'Datos Guardados Correctamente',
                    status:'Suscess',
                    NewTask
                }
            )
        } catch (error) {
            return res.status(500).json(
                {
                    msg: 'error',
                    status: 'error',
                    error
                }
            )
        }
    },
    delite: async (req, res) => {
        const { id } = req.params
        try {
            const DelTask = await Model_Task.destroy({
                where: {
                    id: id
                }
            });
            if (!DelTask) {
                return res.status(400).json(
                    {
                        msg: 'No se Elimino la tarea',
                        status: 'Fallido',
                    }
                )
            }
            return res.status(200).json(
                {
                    msg: 'Se A Elimino la tarea',
                    status: 'Suscess',
                }
            )
        } catch (error) {
            return res.status(500).json(
                {
                    msg: 'error',
                    status: 'error',
                    error
                }
            )
        }
    },
    update: async (req, res) => {
        const { name, description } = req.body
        const { id } = req.params
        try {
            const UpadateTask = await Model_Task.update(
                { 
                    name,
                    description
                }, {
                where: {
                    id: id
                }
            });
            if(UpadateTask == 0){
            return res.status(404).json(
                {
                    msg:"No se encontro el registro a actulizar",
                    status: 'Fallido'
                }
            )
            }
            return res.status(201).json(
                {
                    msg:"Registros Actualizados Correctamente",
                    status: 'Suscess',
                    UpadateTask
                }
            )
        } catch (error) {
            return res.status(500).json(
                {
                    msg: 'error',
                    status: 'error',
                    error
                }
            )
        }
    }
}

module.exports = Controller_task