import userModel from '../models/users.models.js';
import CustomError from "../services/errors/customError.js";
import EErrors from '../services/errors/enums.js';

const postUser = async (req, res, next) => {
    const { first_name, last_name, email, age } = req.body;
    if (!last_name || !first_name || !email) {
        const error = CustomError.createError({
            name: "Error de creacion de usuario",
            cause: generateUserErrorInfo({ first_name, last_name, email }),
            message: "Una o mas propiedades estan incompletas o son invalidas",
            code: EErrors.MISSING_OR_INVALID_USER_DATA
        });
       
        return next(error);
    }
    res.status(200).send({ mensaje: 'Usuario creado' });
};

const getUser = async (req, res) => {
	try {
		const response = await userModel.find();
		res.status(200).send(response);
	} catch (error) {
		res.status(400).send({ error: `Error al consultar usuarios: ${error}` });
	}
};

const usersController = { getUser, postUser };

export default usersController;