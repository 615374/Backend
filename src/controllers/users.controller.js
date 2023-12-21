import userModel from '../models/users.models.js';
import CustomError from "../services/errors/customError.js";
import EErrors from '../services/errors/enums.js';
import mailingController from './mail.controller.js';
import { createHash, validatePassword } from '../utils/bcrypt.js';
import crypto from 'crypto';

const postUser = async (req, res, next) => {
    const { first_name, last_name, email, age } = req.body;
    try {
      if (!last_name || !first_name || !email) {
        CustomError.createError({
            name: "Error de creacion de usuario",
            cause: generateUserErrorInfo({ first_name, last_name, email }),
            message: "Una o mas propiedades estan incompletas o son invalidas",
            code: EErrors.MISSING_OR_INVALID_USER_DATA
        });
    }   

    res.status(200).send({ mensaje: 'Usuario creado' });
    } catch (error){
        next(error);
    }
    
};

const getUser = async (req, res) => {
	try {
		const response = await userModel.find();
		res.status(200).send(response);
	} catch (error) {
		res.status(400).send({ error: `Error al consultar usuarios: ${error}` });
	}
};

const recoveryLinks = {};

const recoveryPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await userModel.find({ email: email });
		if (user) {
			const token = crypto.randomBytes(20).toString('hex');
			recoveryLinks[token] = { email, timestamp: Date.now() };
			const recoveryLink = `http://localhost:8080/api/users/resetpassword/${token}`;
			mailingController.sendPasswordRecoveryEmail(email, recoveryLink);
			res.status(200).send('Correo enviado correctamente');
		} else {
			res.status(404).send({ error: 'Usuario no encontrado' });
		}
	} catch (error) {
		res.status(500).send({ error: `Error en envío de mail de recuperación ${error}` });
	}
};

const resetPassword = async (req, res) => {
	const { token } = req.params;
	const linkData = recoveryLinks[token];
	const { newPassword } = req.body;
	try {
		if (linkData && Date.now() - linkData.timestamp <= 3600000) {
			const { email } = linkData;
			const user = await userModel.findOne({ email: email });
			console.log(newPassword, user.password);
			const arePasswordsEqual = validatePassword(newPassword, user.password);
			if (!arePasswordsEqual) {
				const passwordHash = createHash(newPassword);
				await userModel.findOneAndUpdate({ email: email }, { password: passwordHash });
			} else {
				res.status(400).send(
					'No es posible cambiar la contraseña porque ya fue utilizada con anterioridad'
				);
			}
			delete recoveryLinks[token];
			res.status(200).send('constraseña modificada correctamente');
		} else {
			res.status(400).send('Token inválido o expirado');
		}
	} catch (error) {
		res.status(500).send({ error: `Error al recuperar contraseña ${error}` });
	}
};

const deleteUser = async (req, res) => {
	const { uid } = req.params;

	try {
		const user = await userModel.findByIdAndDelete(uid);
		if (user) {
			return res.status(200).send({ mensaje: 'Usuario eliminado', user: user });
		}

		res.status(404).send({ error: 'Usuario no encontrado' });
	} catch (error) {
		res.status(500).send({ error: `${uid} Error en eliminar usuario ${error}` });
	}
};


const uploadDocuments = async (req, res) => {
	console.log(req.files);
	try {
		const uid = req.params.uid;
		const newDocuments = req.files.map(file => ({
			name: file.originalname,
			reference: file.path,
		}));

		const user = await userModel.findById(uid);
		user.documents.push(...newDocuments);
		await user.save();

		res.status(200).send({ message: 'Documento subido exitosamente' });
	} catch (error) {
		res.status(500).send('Error al cargar archivo');
	}
};
const usersController = {
	getUser,
	postUser,
	recoveryPassword,
	resetPassword,
	deleteUser,
	uploadDocuments,
};

export default usersController;
