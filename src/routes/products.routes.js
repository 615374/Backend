import {Router} from "express";
import { getProduct, getProducts, postProduct, putProduct, deleteProduct } from "../controllers/product.controller.js";
import {passportError, authorization} from "../utils/messageErrors.js"

const routerProd = Router();

routerProd.get('/', getProducts)
routerProd.get('/:pid', getProduct)
routerProd.post('/', passportError('jwt'), authorization(['admin', 'user']), postProduct)
routerProd.put('/:pid', passportError('jwt'), authorization(['admin', 'user']), putProduct)
routerProd.delete('/:pid', passportError('jwt'), authorization(['admin', 'user']), deleteProduct)



export default routerProd;