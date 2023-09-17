import express from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import {engine} from 'express-handlebars'
import routerProd from './routes/products.routes.js'
import routerCart from './routes/cart.routes.js'
import userRouter from './routes/user.routes.js'
import {__dirname} from './path.js'
import {Server} from 'socket.io'
import path from 'path'
import { ProductManager } from './controllers/productManager.js'




const PORT = 4000
const app = express()

mongoose.connect(`mongodb+srv://615374:615374nz@cluster0.svwyk4t.mongodb.net/?retryWrites=true&w=majority`)
.then(() =>  console.log("DB conectada")) 
.catch((error) => console.log("Error en conexion a MongoDB Atlas: ", error))


//Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

const io = new Server(server)

//Config
const storage = multer.diskStorage({
    destination : (req, file, cb) => { //cb = callback
        cb(null, 'src/public/img')

    },
    filename: (req,file,cb) => {
        cb(null, `${Date.now()}${file.originalname}`) //concateno la fecha actual con el nombre del archivo
    }
})


//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}));
/*app.use(cookieParser(process.env.SIGNED_COOKIE))
app.use(session({
    secret: process.env.SIGNED_COOKIE,
    resave: true,
    saveUnitialized: true
}))

*/
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

const upload = multer({storage: storage})
const mensajes = []

//Conexion de Socket.io
io.on("connection", (socket) => {
    console.log("Conexion con Socket.io")

    /*socket.on('mensaje', info => {
        console.log(info)
        socket.emit('respuesta', "Hola usuario, conexion establecida")
       
    })*/

    socket.on('nuevoProducto', async (prod) => {
        //Deberia agregarse al txt o json mediante addProduct
        const confirmacion = await productManager.addProduct(prod)
        if (confirmacion)
            socket.emit("mensajeProductoCreado", "El producto se creo correctamente")
        else
            socket.emit("mensajeProductoCreado","El producto ya existe")
    })


})



//Routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/product',routerProd)
app.use('/api/carts', routerCart);
app.use('/api/users', userRouter)

app.get('/static', (req, res) => {
    // Indica que plantilla voy a utilizar
   
    /*res.render("realTimeProducts", {
        rutaCSS: "realTimeProducts",
        rutaJS: "realTimeProducts",
    })*/

    res.render ('chat', {
        rutaJS: "chat"
    })



})
app.post('/upload', upload.single('product'), (req,res) =>{
    console.log(req.file)
    console.log(req.body)

})


//Cookies

/*app.get('/setCookie', (req,res) =>{
    res.cookie('CookieCookie', 'Esto es el valor de una cookie', {maxAge:30000, signed: true}).send('Cookie creada') //Cookie de un minuto firmada
})

app.get('/getCookie', (req, res)=>{
    res.send(req.signedCookies) //Consultar solo las cookies firmadas
    
})

*/

//Sessions

app.get('/session', (req, res) =>{
    if(req.session.counter){
        req.session.counter++
        res.send(`Has entrado ${req.session.counter}`)
    }
})

app.get('/logout', (req,res) =>{
    req.session.destroy((error)=>{})
})

