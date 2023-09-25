import express from 'express';
import multer from 'multer';
import {engine} from 'express-handlebars';
import {Server} from 'socket.io';
import {__dirname} from './path.js';
import path from 'path';
import mongoose from 'mongoose';
import userModel from './models/users.models.js';
import cartModel from './models/carts.models.js';
import orderModel from './models/order.js';

import routerProd from './routes/products.routes.js';
import routerCart from './routes/cart.routes.js';
import routerUser from './routes/users.routes.js';
import routerMessage from './routes/messages.routes.js';



const app = express()
const PORT = 4000

mongoose.connect('mongodb+srv://615374:615374nz@615374.ohouqzx.mongodb.net/?retryWrites=true&w=majority')
.then(async() => {
    
    console.log("DB conectada")
   
   /*await orderModel.create([
         {name: 'Remera Trash', size: 'small', price: '8500', quantity: '5'},
         {name: 'Remera Original Juan', size: 'medium', price: '8700', quantity: '8'},
         {name: 'Remera Run the jewells', size: 'large', price: '9000', quantity: '3'},
         {name: 'Remera Biggie', size: 'small', price: '8500', quantity: '4'},
         {name: 'Remera N.W.A', size: 'medium', price: '8700', quantity: '6'},
         {name: 'Remera Fugees', size: 'large', price: '9000', quantity: '2'},
         {name: 'Remera Kase O', size: 'small', price: '8500', quantity: '7'},
         {name: 'Remera Wu Tang Clan', size: 'medium', price: '8700', quantity: '5'},
         {name: 'Remera T&K', size: 'large', price: '9000', quantity: '6'},
   ])*/
   
   
    //const cart = await cartModel.findOne({_id:"650b49efc80ac9f82045735f"}).populate('products.id_prod')
    //console.log(JSON.stringify(cart))
    //await cartModel.create({})
}) 
.catch((error) => console.log("Error en conexion a MongoDB Atlas: ", error))



//const resultados = await userModel.find({nombre: 'Ofelio'}).explain('executionStats')
//console.log(resultados)


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
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))
/*app.use(cookieParser(process.env.SIGNED_COOKIE))
app.use(session({
    secret: process.env.SIGNED_COOKIE,
    resave: true,
    saveUnitialized: true
}))

*/

const upload = multer ({storage: storage})
const mensajes = []

//Conexion de Socket.io
io.on("connection", (socket) => {
    console.log("Conexion con Socket.io")

    socket.on('mensaje', info => {
        console.log(info)
        mensajes.push(info)
        io.emit('mensajes', mensajes)
       
    })

   /* socket.on('load', async () => {
        //Deberia agregarse al txt o json mediante addProduct
        const data = await productModel.paginate({}, {limit: 5});
        if (confirmacion)
            socket.emit("mensajeProductoCreado", "El producto se creo correctamente")
        else
            socket.emit("mensajeProductoCreado","El producto ya existe")
    })*/


})



//Routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/products',routerProd)
app.use('/api/carts', routerCart);
app.use('/api/messages', routerMessage)
app.use('/api/users', routerUser)

app.get('/static', (req, res) => {
    // Indica que plantilla voy a utilizar
   
    /*res.render("realTimeProducts", {
        rutaCSS: "realTimeProducts",
        rutaJS: "realTimeProducts",
    })*/

    res.render ("chat", {
        rutaJS: "chat",
        rutaCSS:"style"
    })



})

app.post('/upload', upload.single('product'), (req,res) =>{
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("Imagen cargada")

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

/*app.get('/session', (req, res) =>{
    if(req.session.counter){
        req.session.counter++
        res.send(`Has entrado ${req.session.counter}`)
    }
})

app.get('/logout', (req,res) =>{
    req.session.destroy((error)=>{})
})

*/