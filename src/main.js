import express from 'express'
import multer from 'multer'
import routerProd from './routes/products.routes.js'
import {__dirname} from './path.js'


const PORT = 4000
const app = express()

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
const upload = multer({storage: storage})

//Routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/product',routerProd)
app.post('/upload', upload.single('product'), (req,res) =>{
    console.log(req.file)
    console.log(req.body)

})

//Server
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

