import { Router } from "express";
import { passportError, authorization } from "../utils/messageErrors.js";
import passport from "passport";
import sessionController from '../controllers/sessions.controller.js';

const routerSessions = Router() 

routerSessions.post('/login', sessionController.postSession, passport.authenticate('login'));

routerSessions.get('/current', sessionController.getCurrentSession, passportError('jwt'));

routerSessions.get(
	'/github',
	passport.authenticate('github', { scope: ['user: email'] }),
	sessionController.getGithubCreateUser
);

routerSessions.get(
	'/githubSession',
	passport.authenticate('github'),
	sessionController.getGithubSession
);

routerSessions.get('/logout', sessionController.getLogout);

export default routerSessions;