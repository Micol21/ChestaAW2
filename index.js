import dotenv from "dotenv"
dotenv.config()

console.log('PORT desde .env:', process.env.PORT)

import express from "express"
import { readFile, writeFile } from 'fs/promises'//poder leer y escribir en un json
import productosroutes from './routes/productos.routes.js'
import fs from 'fs'


import { get_user_byId } from "./utils/user.js"

const objetos = [
  { name: 'auto', color: 'rojo' },
  { name: 'bicicleta', color: 'azul' },
  { name: 'moto', color: 'negro' },
  { name: 'camión', color: 'blanco' }
]

const main = async () => {
  const file = await readFile('./data/productos.json', 'utf-8')
  const userData = JSON.parse(file)

  const app = express()
  const port = process.env.PORT || 3000

  app.use(express.json())

  // Rutas
  app.get('/', (req, res) => {
    res.send('Hola Mundo!')
  })

  app.get('/codigos', (req, res) => {
    res.send('JS!!')
  })

  app.get('/colorDe/:objeto', (req, res) => {
    const obj = req.params.objeto
    const result = objetos.find(e => e.name === obj)

    if (result) {
      res.status(200).json(result)
    } else {
      res.status(404).json(`${obj} no se encuentra`)
    }
  })

  app.post('/ColorDePost',(req,res)=>{
    const obj = req.body.objeto
    const result = objetos.find(e => e.name === obj)

    if (result) {
      res.status(200).json(result)
    } else {
      res.status(404).json(`${obj} no se encuentra`)
    }
  })

  

  app.post('/usuarios/login', (req, res) => {
    const { usuario, password } = req.body;
  
    const usuarios = JSON.parse(fs.readFileSync('./data/usuarios.json'));
    const existe = usuarios.find(u => u.usuario === usuario && u.password === password);
  
    if (existe) {
      res.status(200).json('Login exitoso');
    } else {
      res.status(401).json('Credenciales inválidas');
    }
  });

  //**RUTA DE PRODUCTOS**//

  app.use('/productos/',productosroutes)

  app.get('/productos/all',(req,res)=>{//probar en el postman si andaba o no el json
    res.status(200).json(userData)
  })

  // 2. ESCUCHAR EL SERVIDOR
  app.listen(port, () => {
    console.log(`Servidor levantado en puerto ${port}`)
  })
  
}

main()

