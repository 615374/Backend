import {Router} from "express";
import {userModel} from "../models/users.model.js"

const routerUser = Router()

routerUser.get('/', async(req,res) =>{
    try{
        const users = await userModel.find();
        res.status(200).send({resultado: 'OK', message: users})
    } catch(error){
        res.status(400).send({error: `Error al consultar usuario: ${error}`})

    }
})

routerUser.post('/', async(req,res)=> {
    try{
        const {nombre, apellido, edad, password, email} = req.body
        const respuesta = await userModel.create({
            nombre, apellido, edad, password, email
        })
        res.status(200).send({resultado: 'OK', message: respuesta})
    } catch(error){
        res.status(400).send({error: `Error al crear usuario: ${error}`})

    }
})

export default routerUser