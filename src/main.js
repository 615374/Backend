import express from 'express'
import multer from 'multer'
import {engine} from 'express-handlebars'
import routerProd from './routes/products.routes.js'
import {__dirname} from './path.js'
import {Server} from 'socket.io'
import path from 'path'



const PORT = 4000
const app = express()

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

const upload = multer({storage: storage})
const mensajes = []

//Conexion de Socket.io
io.on("connection", (socket) => {
    console.log("Conexion con Socket.io")

    socket.on('mensaje', info => {
        console.log(info)
        socket.emit('respuesta', "Hola usuario, conexion establecida")
       
    })

})

//Routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/product',routerProd)
app.get('/static', (req, res) => {
    // Indica que plantilla voy a utilizar
   
    res.render("realTimeProducts", {
        rutaCSS: "realTimeProducts",
        rutaJS: "realTimeProducts",
    })
})
app.post('/upload', upload.single('product'), (req,res) =>{
    console.log(req.file)
    console.log(req.body)

})




