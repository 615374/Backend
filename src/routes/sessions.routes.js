import { Router } from "express";
import { passportError, authorization } from "../utils/messageErrors.js";
import { generateToken } from "../utils/jwt.js";
import passport from "passport";

const routerSessions = Router() 


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

        const token = generateToken(req.user)
        res.cookie('jwtCookie', token, {
            maxAge: 43200000
        })

        res.status(200).send({ payload: req.user })
    } catch (error) {
        res.status(500).send({ mensaje: `Error al iniciar sesion ${error}` })
    }
})

routerSessions.get('/testJWT', passport.authenticate('jwt', { session: true }), 
async (req, res) => {
    res.status(200).send({ mensaje: req.user })
  
    req.session.user = {
        first_name: req.user.user.first_name,
        last_name: req.user.user.last_name,
        age: req.user.user.age,
        email: req.user.user.email
    }

})

routerSessions.get('/current', passportError('jwt'), authorization('user'), (req, res) => {
    res.send(req.user)
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