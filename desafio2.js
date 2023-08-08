import {promises as fs} from 'fs'


const addProduct = async (product) => {

    //Consulto el txt y lo parseo
    const products = JSON.parse(await fs.readFile('./productos.txt','utf-8'))
    console.log(products)

    //Consulto si mi producto ya existe en mi txt
    if(products.find(producto => producto.id == product.id)){
        return "Producto ya agregado"
    }

    //Lo agrego al array
    products.push(product)

    //Parseo y guardo el array modificado
    await fs.writeFile('./productos.txt', JSON.stringify(products))

}

const getProducts = async () => {
    const products = JSON.parse(await fs.readFile('./productos.txt','utf-8'))
    console.log(products)
}

const getProductById = async (id) => {
    const products = JSON.parse(await fs.readFile('./productos.txt','utf-8'))
    const prod = products.find(producto => producto.id === id)
    if (prod) {
        console.log(prod)
    } else {
        console.log("Producto no existe")
    }
}


const updateProduct = async (id, {nombre}) => {
    const products = JSON.parse(await fs.readFile('./productos.txt','utf-8'))
    const indice = products.findIndex(prod => prod.id === id)

    if(indice != -1){
        //Modifico todos los atributos presentes de mi objeto mediante el indice
        products[indice].nombre = nombre
        await fs.writeFile('./productos.txt', JSON.stringify(products))

    }else {
        console.log("Producto no encontrado")
    }


}

const deleteProduct = async (id) => {
    const products = JSON.parse(await fs.readFile('./productos.txt','utf-8'))
    // Traeme todos los productos cuyo id sea distinto del id ingresado
    const prods = products.filter(prod => prod.id != id)
    //Ese array modificamelo
    await fs.writeFile('./productos.txt', JSON.stringify(products))

}


//addProduct({ nombre: "Bufanda", id: 4})

//getProducts()

//getProductById(2)

//updateProduct (1, {nombre: "Bufanda"})

//deleteProduct(3)