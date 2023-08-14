import express from 'express'

const app = express ()
const PORT = 4000
const PATH = "./users.json"

app.use(express.urlencoded({extended: true}))
app.use (express.json()) //Permitir trabajar con el formato JSON en express

app.get('/',  (req, res) => {
    res.send("Pagina inicial")
})

app.post('/users', async (req, res) =>{
    const {nombre, apellido, email, password} = req.body

    const users = JSON.parse(await fs.readFile(PATH, 'utf-8'))
    const user = users.find(usuario => usuario.email === email)
    
    if (user) {
        res.status(400).send("Usuario ya existente")
    }

    users.push(user)
    await fs.writeFile(PATH, JSON.stringify(users))
    res.status(200).send("Usuario creado")


})

app.listen(PORT, () => {

})

