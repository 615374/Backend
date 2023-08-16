import {promises as fs} from 'fs';

export class ProductManager {
    constructor() {
        this.path = 'src/models/productos.json'
    }



  //Add Product function
 async addProduct(product) {

    //Consulto el txt y lo parseo
    const products = JSON.parse(await fs.readFile(this.path,'utf-8'))
    console.log(products);

    //Consulto si mi producto ya existe en mi txt
    if(products.find(producto => producto.code == product.code)){
        return "Producto ya existente"
    }

    else{ //Lo agrego al array
        prod.id = ProductManager.incrementID()
        products.push(product)
        //Parseo y guardo el array modificado
        await fs.writeFile(this.path, JSON.stringify(products))
        return products
    }
   

 }

 //Get Products function
 async getProducts() {
    const products = JSON.parse(await fs.readFile(this.path,'utf-8'))
    console.log(products)
 }

 //Get Product By ID function
 async getProductById(id) {
 const products = JSON.parse(await fs.readFile(this.path,'utf-8'))
    const prod = products.find(producto => producto.id === id)
    if (prod) {
        console.log(prod)
    } else {
        console.log("Producto no encontrado")
    }
 }

 //Update Product function
 async updateProduct (id, {title, description, price, thumbnail,code, stock}) {
    const products = JSON.parse(await fs.readFile(this.path,'utf-8'))
    const indice = products.findIndex(prod => prod.id === id)

    if(indice != -1) {
        //Modifico todos los atributos presentes de mi objeto mediante el indice
        products[indice].title = title
        products[indice].description = description
        products[indice].price = price
        products[indice].image = image
        products[indice].thumbnail = thumbnail
        products[indice].code = code
        products[indice].stock = stock

        await fs.writeFile(this.path, JSON.stringify(products))

    }else {
        console.log("Producto no encontrado")
    }

 }

 //Delete Product function
 async deleteProduct(id) {
    const products = JSON.parse(await fs.readFile(this.path,'utf-8'))
    // Trae todos los productos cuyo id sea distinto del id ingresado
    const prod = products.find(item => item.id === id)
    if (!prod) {
        console.log ("Producto no encontrado")
    }
    
    const prods = products.filter(prod => prod.id != id)
    products = prods;
    //Modifica el array
    await fs.writeFile(this.path, JSON.stringify(products))

 }
}

export class Product {
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


const product1= new Product("Cartera","Mini-bag negra con tachas", 30.000,"imagen no disponible","C5", 10)
const product2= new Product("Reloj","Tactil color silver", 15.000,"imagen no disponible","R4",20)
const product3= new Product("Pulsera","Con strass color gold",10.000,"imagen no disponible","P6",30)

const productManager = new ProductManager

productManager.getProducts()
productManager.addProduct(product1)
//productManager.addProduct(product2)
//productManager.addProduct(product3)

//productManager.getProducts()

//productManager.getProductById(1)
//productManager.getProductById(2)
//productManager.getProductById(3)

//productManager.updateProduct (1, {title: "Bufanda"})

//productManager.deleteProduct(3)