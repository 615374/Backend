class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {
    constructor() {
        this.products = [];
        this.productIdCounter = 1;
    }

    addProduct(productData) {
        // Validar que todos los campos sean obligatorios
        if (!productData.title || !productData.description || !productData.price || !productData.thumbnail || !productData.code || !productData.stock) {
            console.log("Todos los campos son obligatorios");
            return;
        }

        // Validar que el campo "code" no se repita
        const codigo = productData.code;
        const productoExistente = this.products.find((producto) => producto.code === codigo);
        if (productoExistente) {
            console.log("El código de este producto ya existe");
            return;
        }

        // Agregar el producto al arreglo con un id autoincrementable
        const productoConId = {
            ...productData,
            id: this.productIdCounter,
        };
        this.productIdCounter++;

        this.products.push(productoConId);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const producto = this.products.find((producto) => producto.id === id);
        if (!producto) {
            console.error("Producto no encontrado");
            return null;
        }
        return producto;
    }
}

// Ejemplo de uso:

const productManager = new ProductManager();

productManager.addProduct({
    title: "Cartera",
    description: "Mini-bag negra con tachas",
    price: 30.000,
    thumbnail: "imagen no disponible",
    code: "C5",
    stock: 10,
});

productManager.addProduct({
    title: "Reloj",
    description: "Tactil color silver",
    price: 15.000,
    thumbnail: "imagen no disponible",
    code: "R4",
    stock: 20,
});

productManager.addProduct({
    title: "Pulsera",
    description: "Con strass color gold",
    price: 10.000,
    thumbnail: "imagen no disponible",
    code: "P6",
    stock: 30,
});

console.log(productManager.getProducts());
console.log(productManager.getProductById(1));
console.log(productManager.getProductById(2));
console.log(productManager.getProductById(3)); 