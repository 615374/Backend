import express from 'express';
import {ProductManager} from './main.js';
import {Product} from './main.js';

const app = express()

const PORT = 4000

const manager = new ProductManager('./src/productos.txt');

app.use(express.urlencoded({extended: true}));

app.get ('/', (req,res) => {
    res.send("Hola desde la pagina de inicio de la app");
});

app.get('/productos/:id', async (req, res) => {
    const prod = await manager.getProductById(parseInt(req.params.id));
    prod ? res.send(prod) : res.send("Producto no encontrado");  
});


app.get('/productos', async (req, res) => {
    const {limit} = req.query;
    const prods = await manager.getProducts();
    limit ? res.send(prods.slice(0, limit)) : res.send(prods);
});

app.get('*', (req, res) => {
    res.send("Error 404")
});

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
});

