import 'dotenv/config'
import bcrypt from 'bcrypt'

//Encriptar contrasena 
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT)))

const hashPassword = createHash("coderhouse")

export const validatePassword = (passwordSend, passwordBDD) => bcrypt.compareSync(passwordSend, passwordBDD)

console.log(validatePassword("coderhouse", hashPassword))