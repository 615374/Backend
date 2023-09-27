import {Router} from "express";
import productModel from "../models/products.models.js";

const routerProd = Router();

routerProd.get('/', async (req, res) => {
    const {limit, page, sort, category, status} = req.body
    try{
        const prods = await productModel.find().limit(limit)
        res.status(200).send({resultado: 'OK', message: prods})

    } catch (error) {
        res.status(400).send({error: `Error al consultar productos: ${error}`})

    }
})

routerProd.get('/:pid', async (req, res) => {
    const {id} = req.params
    try{
        const prod = await productModel.findById(pid)
        if(prod)
            res.status(200).send({resultado: 'OK', message: prod})
        else
            res.status(404).send({resultado: 'Producto no encontrado', message: prod})
    } catch (error) {
        res.status(400).send({error: `Error al consultar productos: ${error}`})
    
    }

})

routerProd.post('/', async (req, res) => {
    const {title, description, price, stock, category, code} = req.body
    
    try{
        const respuesta = await productModel.create({
            title, description, stock, code, price, category
        })
        
        res.status(200).send({resultado: 'OK', message: respuesta})
        
    } catch (error) {
        res.status(400).send({error: `Error al crear producto: ${error}`})
    
    }

})

routerProd.put('/:pid', async (req, res) => {
    const {pid} = req.params
    const {title, description, price, stock, category, code} = req.body
    
    try{
        const respuesta = await productModel.findByIdAndUpdate(pid, {title, description, price, stock, category, status, code})
        if (prod)
           res.status(200).send({resultado: 'OK', message: respuesta})
        else
           res.status(404).send({ resultado: 'Producto no encontrado', message: respuesta})
    } catch (error) {
        res.status(400).send({error: `Error al actualizar producto: ${error}`})
    
    }

})

routerProd.delete('/:pid', async (req, res) => {
    const {pid} = req.params
   
    try{
        const respuesta = await productModel.findByIdAndDelete(pid)
        if (prod)
           res.status(200).send({resultado: 'OK', message: respuesta})
        else
           res.status(404).send({ resultado: 'Producto no encontrado', message: respuesta})
    } catch (error) {
        res.status(400).send({error: `Error al eliminar producto: ${error}`})
    
    }

})

export default routerProd;