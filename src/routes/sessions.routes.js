import { Router } from "express";
import userModel from "../models/users.models.js";

const routerSessions = Router()

routerSessions.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        if (req.session.login)
            res.status(200).send({ resultado: 'Login ya existente' })
        const user = await userModel.findOne({ email: email })

        if (user) {
            if (user.password == password) {
                req.session.login = true
                res.status(200).send({ resultado: 'Login valido', message: user })
                //res.redirect('ruta', 200, {'info': user}) Redireccion
            } else {
                res.status(401).send({ resultado: 'Unauthorized', message: user })
            }
        } else {
            res.status(404).send({ resultado: 'Not Found', message: user })
        }
    } catch (error) {
        res.status(400).send({ error: `Error en login: ${error}` })
    }
})

routerSessions.get('/logout', (req, res) => {
    if (req.session.login) {
        req.session.destroy()
    }
    res.status(200).send({ resultado: 'Login eliminado' })
})

export default routerSessions;