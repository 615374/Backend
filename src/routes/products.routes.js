import {Router} from "express";
import { getProduct, getProducts, postProduct, putProduct, deleteProduct } from "../controllers/product.controller.js";
import {passportError, authorization} from "../utils/messageErrors.js"

const routerProd = Router();

routerProd.get('/', getProducts)
routerProd.get('/:id', getProduct)
routerProd.post('/', passportError('jwt'), authorization(['Admin', 'user']), postProduct)
routerProd.put('/:id', passportError('jwt'), authorization('Admin'), putProduct)
routerProd.delete('/:id', passportError('jwt'), authorization('Admin'), deleteProduct)



export default routerProd;