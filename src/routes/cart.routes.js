import {Router} from 'express';
import cartModel from "../models/carts.models.js";
import productModel from "../models/products.models.js"


const routerCart = Router();

routerCart.get('/', async (req, res) => {
	const { limit } = req.query;
	try {
		const carts = await cartModel.find().limit(limit);
		res.status(200).send({ resultado: 'OK', message: carts });
	} catch (error) {
		res.status(400).send({ error: `Error al consultar carritos: ${error}` });
	}
});

routerCart.get('/:cid', async (req, res) => {
	const { cid } = req.params;
	try {
		const cart = await cartModel.findById(cid);
		if(cart)
            res.status(200).send({resultado: 'OK', message: cart})
        else
            res.status(404).send({resultado: 'Carrito no encontrado', message: cart})
 	} catch (error) {
		res.status(400).send({ error: `Error al consultar carrito: ${error}` });
	}
});

routerCart.post('/', async (req, res) => {
	try {
		const respuesta = await cartModel.create({});
		res.status(200).send({ resultado: 'OK', message: respuesta });
	} catch (error) {
		res.status(400).send({ error: `Error al crear producto: ${error}` });
	}
});

routerCart.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params
    
    try {
        const cart = await cartModel.findById(cid)
        const product = await productModel.finById(pid)
        
        if (!product) {
            res.status(404).send({ respuesta: 'Producto no encontrado', mensaje: product });
            return false;
        }  

        if (cart) {
            const productExists = cart.products.find(prod => prod.id_prod == pid);  
            productExists
            ? productExists.quantity++
            : cart.products.push({ id_prod: product._id, quantity: 1})
            await cart.save();    
            res.status(200).send({ respuesta: 'Ok', mensaje: cart })
        
        } else {
            res.status(404).send({ respuesta: 'Carrito no encontrado', mensaje: cart });
        }
    } catch (error) {
        res.status(400).send({ error: `Error al agregar producto: ${error}` })
    }
});

routerCart.put('/:cid/products/:pid', async (req, res) => {
	const { cid, pid } = req.params;
	const { quantity } = req.body;

	try {
		const cart = await cartModel.findById(cid);

		if (cart) {
			const productExists = cart.products.find(prod => prod.id_prod == pid);
			if (productExists) {
				productExists.quantity += quantity;
			} else {
				res.status(404).send({ resultado: 'Producto no encontrado', message: cart });
				return;
			}
			await cart.save();
			res.status(200).send({ resultado: 'OK', message: cart });
		} else {
			res.status(404).send({ resultado: 'Carrito no encontrado', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al agregar productos: ${error}` });
	}
});

routerCart.delete('/:cid', async (req, res) => {
	const { cid } = req.params;
	try {
		const cart = await cartModel.findByIdAndUpdate(cid, { products: [] });
		if(cart)
            res.status(200).send({resultado: 'OK', message: cart})
        else
            res.status(404).send({resultado: 'Carrito no encontrado', message: cart})
	} catch (error) {
		res.status(400).send({ error: `Error al eliminar carrito: ${error}` });
	}
});


routerCart.delete('/:cid/products/:pid', async (req, res) => {
	const { cid, pid } = req.params;

	try {
		const cart = await cartModel.findById(cid);
		if (cart) {
			const productIndex = cart.products.findIndex(prod => prod.id_prod == pid);
			let deletedProduct;
			if (productIndex !== -1) {
				deletedProduct = cart.products[productIndex];
				cart.products.splice(productIndex, 1);
			} else {
				res.status(404).send({ resultado: 'Producto no encontrado', message: cart });
				return;
			}
			await cart.save();
			res.status(200).send({ resultado: 'OK', message: deletedProduct });
		} else {
			res.status(404).send({ resultado: 'Carrito no encontrado', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al eliminar producto: ${error}` });
	}
});



export default routerCart;

