import { Router } from 'express';
import passport from 'passport';
import usersController from '../controllers/users.controller.js';

const routerUser = Router();

routerUser.post('/', usersController.postUser, passport.authenticate('register'));

routerUser.get('/', usersController.getUser);

export default routerUser;