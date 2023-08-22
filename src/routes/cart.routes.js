import { Router } from 'express';
import { CartManager } from '../controllers/cartManager.js';

const routerCart = Router();
const cartManager = new CartManager('./src/models/carts.json', './src/models/products.json');

routerCart.get('/:cid', async (req, res) => {
	const { cid } = req.params;
	const products = await cartManager.getProductsFromCart(parseInt(cid));
	if (products)
    res.status(200).send(products)

    else
    res.status(400).send("Carrito inexistente")
});

routerCart.post('/', async (req, res) => {
	await cartManager.createCart();
	res.status(200).send('Carrito creado correctamente');
});

routerCart.post('/:cid/product/:pid', async (req, res) => {
	const { cid, pid } = req.params;
	const confirmacion = await cartManager.addProductToCart(parseInt(cid), parseInt(pid));
	if (confirmacion)
    res.status(200).send("Producto agregado correctamente")

    else
    res.status(400).send("Producto o carrito inexistente")
});

export default routerCart;