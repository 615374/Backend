import { Router } from "express";
import userModel from "../models/users.models.js";
import {validatePassword} from "../utils/bcrypt.js";
import passport from "passport";

const routerSessions = Router() 

/*
routerSessions.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        if (req.session.login)
            res.status(200).send({ resultado: 'Login ya existente' })
        const user = await userModel.findOne({ email: email })

        if (user) {
            if (validatePassword(password, user.password)) {
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
}) */

routerSessions.post('/login', passport.authenticate('login'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ mensaje: "Invalidate user" })
        }

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
        }

        res.status(200).send({ payload: req.user })
    } catch (error) {
        res.status(500).send({ mensaje: `Error al iniciar sesion ${error}` })
    }
})

routerSessions.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    res.status(200).send({ mensaje: 'Usuario creado' })
})

routerSessions.get('/githubSession', passport.authenticate('github'), async (req, res) => {
    req.session.user = req.user
    res.status(200).send({ mensaje: 'Session creada' })
})

routerSessions.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy()
    }
    console.log(req.session)
    res.status(200).send({ resultado: 'Login eliminado' })
})


routerSessions.get('/logout', (req, res) => {
    if (req.session.login) {
        req.session.destroy()
    }
    res.status(200).send({ resultado: 'Login eliminado' })
})

export default routerSessions;