import {Router} from "express";
import userModel from "../models/users.models.js"

const routerUser = Router()


routerUser.post('/', async(req,res)=> {
    const { first_name, last_name, email, password, age } = req.body
    try {
        const response = await userModel.create({ 
            first_name: first_name, 
            last_name: last_name, 
            email: email, 
            password: hashPassword, 
            age:age 
        })
        res.status(200).send({ mensaje: 'Usuario creado', respuesta: response })
    } catch (error) {
        const hashPassword = createHash(password)
        res.status(400).send({ error: `Error en create user: ${error}` })
    }

})

export default routerUser;