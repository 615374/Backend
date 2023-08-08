import {promises as fs} from 'fs';

class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.id = Product.incrementID()

    }

    static incrementID() {
        this.idIncrement = this.idIncrement ? this.idIncrement + 1 : 1
        return this.idIncrement
    }
}
class ProductManager {
    constructor() {
        this.path = './productos.txt'
    }



//Add Product function
addProduct = async (product) => {

    //Consulto el txt y lo parseo
    const products = JSON.parse(await fs.readFile(this.path,'utf-8'))
    console.log(products)

    //Consulto si mi producto ya existe en mi txt
    if(products.find(producto => producto.id == product.id)){
        return "Producto ya agregado"
    }

    else{ //Lo agrego al array
        products.push(product)
    }

    //Parseo y guardo el array modificado
    await fs.writeFile(this.path, JSON.stringify(products))

}

//Get Products function
getProducts = async () => {
    const products = JSON.parse(await fs.readFile(this.path,'utf-8'))
    console.log(products)
}

//Get Product By ID function
getProductById = async (id) => {
    const products = JSON.parse(await fs.readFile(this.path,'utf-8'))
    const prod = products.find(producto => producto.id === id)
    if (prod) {
        console.log(prod)
    } else {
        console.log("Producto no encontrado")
    }
}

//Update Product function
updateProduct = async (id, {title, description, price, thumbnail,code, stock}) => {
    const products = JSON.parse(await fs.readFile(this.path,'utf-8'))
    const indice = products.findIndex(prod => prod.id === id)

    if(indice != -1) {
        //Modifico todos los atributos presentes de mi objeto mediante el indice
        products[indice]
        .title = title
        .description = description
        .price = price
        .image = image
        .thumbnail = thumbnail
        .code = code
        .stock = stock
        await fs.writeFile(this.path, JSON.stringify(products))

    }else {
        console.log("Producto no encontrado")
    }

}

//Delete Product function
deleteProduct = async (id) => {
    const products = JSON.parse(await fs.readFile(this.path,'utf-8'))
    // Trae todos los productos cuyo id sea distinto del id ingresado
    const prods = products.filter(prod => prod.id != id)
    //Modifica el array
    await fs.writeFile(this.path, JSON.stringify(products))

}
}

const product1= new Product("Cartera","Mini-bag negra con tachas", 30.000,"imagen no disponible","C5", 10)
const product2= new Product("Reloj","Tactil color silver", 15.000,"imagen no disponible","R4",20)
const product3= new Product("Pulsera","Con strass color gold",10.000,"imagen no disponible","P6",30)

const productManager = new ProductManager()

productManager.getProducts()

//productManager.addProduct(product1)
//productManager.addProduct(product2)
//productManager.addProduct(product3)

//productManager.getProducts()

//productManager.getProductById(1)
//productManager.getProductById(2)
//productManager.getProductById(3)

//productManager.updateProduct (1, {title: "Bufanda"})

//productManager.deleteProduct(3)