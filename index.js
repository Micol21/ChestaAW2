import dotenv from "dotenv"
dotenv.config()

console.log('PORT desde .env:', process.env.PORT)

import express from "express"
//import { readFile } from 'fs/promises'//poder leer y escribir en un json
import productosroutes from './routes/productos.routes.js'
import usersroutes from './routes/usuarios.routes.js'




const main = async () => {
  

  const app = express()
  const port = process.env.PORT || 3000

  app.use(express.json())

  // 1. PARA LEVANTAR NUESTRO FRONEND
  app.use(express.static('./public'))//todo lo que este en la carpeta public lo va a renderizar

// 2. RUTA DE ENDPOINTS
  //**RUTA DE USUARIOS**//

  app.use('/users',usersroutes)

  

  //**RUTA DE PRODUCTOS**//

  app.use('/productos',productosroutes)

  

  // 3. ESCUCHAR EL SERVIDOR
  app.listen(port, () => {
    console.log(`Servidor levantado en puerto ${port}`)
  })

  
 

  
  
}

main()

