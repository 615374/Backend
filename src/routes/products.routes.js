import {Router} from "express";
import { getProduct, getProducts, postProduct, putProduct, deleteProduct } from "../controllers/product.controller.js";
import {passportError, authorization} from "../utils/messageErrors.js"

const routerProd = Router();

routerProd.get('/', getProducts)
routerProd.get('/:id', getProduct)
routerProd.post('/', passportError('jwt'), authorization(['admin', 'user']), postProduct)
routerProd.put('/:id', passportError('jwt'), authorization(['admin', 'user']), putProduct)
routerProd.delete('/:id', passportError('jwt'), authorization(['admin', 'user']), deleteProduct)



export default routerProd;