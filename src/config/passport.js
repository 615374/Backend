import local from 'passport-local'
import passport from 'passport'
import {createHash, validatePassword} from '../utils/bcrypt.js'

const LocalStrategy = local.Strategy

const initializePassport = () => {

 passport.use('register', new LocalStrategy(
    {passReqToCallback: true,
    usernameField: 'email'}, async (req, username, passport, done)
 ))

}