import dotenv from "dotenv"
dotenv.config()

console.log('PORT desde .env:', process.env.PORT)

import express from "express"
import { readFile, writeFile } from 'fs/promises'//poder leer y escribir en un json
import productosroutes from './routes/productos.routes.js'
import fs from 'fs'
import usersroutes from './routes/usuarios.routes.js'

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

  // 2. PARA LEVANTAR NUESTRO FRONEND
  app.use(express.static('./public'))//todo lo que este en la carpeta public lo va a renderizar

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

  
//**RUTA DE USUARIOS**//

  app.use('/users',usersroutes)

  

  //**RUTA DE PRODUCTOS**//

  app.use('/productos/',productosroutes)

  app.get('/productos/all',(req,res)=>{//probar en el postman si andaba o no el json
    res.status(200).json(userData)
  })

  // 1. ESCUCHAR EL SERVIDOR
  app.listen(port, () => {
    console.log(`Servidor levantado en puerto ${port}`)
  })

  
 

  // 3. RUTA DE ENDPOINTS
  
}

main()

