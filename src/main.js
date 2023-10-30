import 'dotenv/config'; //Permite usar variables de entorno
import express from 'express';
import multer from 'multer';
import {engine} from 'express-handlebars';
import {Server} from 'socket.io';
import {__dirname} from './path.js';
import path from 'path';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import orderModel from './models/order.models.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport'
import initializePassport from './config/passport.js';

import routerProd from './routes/products.routes.js';
import routerCart from './routes/cart.routes.js';
import routerUser from './routes/users.routes.js';
import routerMessage from './routes/messages.routes.js';
import routerSessions from './routes/sessions.routes.js';



const app = express()
const PORT = 4000

mongoose.connect(process.env.MONGO_URL)
.then(async() => {
    console.log("DB conectada")
 
}) 
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
app.use(cookieParser(process.env.SIGNED_COOKIE)) // Firmo la cookie
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 60
    }),

    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())


function auth(req,res,next){
    console.log(req.session.email)

    if(req.session.email == "admin@admin.com" && req.session.password == "1234") { 
        return next() //Continua con la ejecucion normal de la ruta
    }
    return res.send("No tenes acceso a este contenido")
}

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))


const upload = multer ({storage: storage})
const mensajes = []

//Conexion de Socket.io
io.on("connection", (socket) => {
    console.log("Conexion con Socket.io")

    socket.on('load', async () => {
       
        const data = await productModel.paginate({}, {limit: 5});
        socket.emit('products', data)
    })
})


//Routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/products',routerProd)
app.use('/api/carts', routerCart);
app.use('/api/messages', routerMessage)
app.use('/api/users', routerUser)
app.use('/api/sessions', routerSessions)

app.get('/static', (req, res) => {
    // Indica que plantilla voy a utilizar
    res.render('index', {
		rutaCSS: 'index',
		rutaJS: 'index',
	});
});

app.get('/static/realtimeproducts', (req, res) => {
 
    res.render('realTimeProducts', {
        rutaCSS: 'realTimeProducts',
        rutaJS: 'realTimeProducts',
    });

});

app.get('/static/chat', (req, res) => {
    res.render ('chat', {
        rutaCSS:'chat',
        rutaJS: 'chat'   
    });
});

app.post('/upload', upload.single('product'), (req,res) =>{
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("Imagen cargada")

})


//Cookies

app.get('/setCookie', (req,res) =>{
    res.cookie('CookieCookie', 'Esto es el valor de una cookie', 
    {maxAge:30000, signed: true}).send('Cookie creada') //Cookie de un minuto firmada
})

app.get('/getCookie', (req, res)=>{
    res.send(req.signedCookies) //Consultar solo las cookies firmadas
    
})



//Sessions

app.get('/session', (req, res) =>{
    if(req.session.counter){ //Si existe la variable counter en la session
        req.session.counter++
        res.send(`Has entrado ${req.session.counter} veces a mi pagina`)
    } else {
        req.session.counter = 1
        res.send("Hola, por primera vez")
    }
})

app.get('/login', (req,res)=>{
    const {email, password} = req.body
    
        req.session.email = email
        req.session.password = password
        return res.send("Usuario logueado")
   
return res.send("Login fallido")   
})


app.get('/admin', auth, (req, res) =>{
    res.send("Sos admin")
})


app.get('/logout', (req,res) =>{
    req.session.destroy((error)=>{
         if (error)
            console.log(error)
        else
            res.redirect('/')
    })
})

