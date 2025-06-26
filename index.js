import express from "express"
import dotenv from "dotenv"
import cors from 'cors'
import productosroutes from './routes/productos.routes.js'
import usersroutes from './routes/usuarios.routes.js'
import ventasRoutes from './routes/ventas.routes.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())


const port = process.env.PORT || 5000

console.log('PORT desde .env:', process.env.PORT)








const main = async () => {
  

  
  

  

  // 1. PARA LEVANTAR NUESTRO FRONEND
  app.use(express.static('./public'))//todo lo que este en la carpeta public lo va a renderizar

// 2. RUTA DE ENDPOINTS

  //**RUTA DE USUARIOS**//

  app.use('/users',usersroutes)

  

  //**RUTA DE PRODUCTOS**//

  app.use('/productos',productosroutes)

  //**RUTA DE VENTAS**//
  app.use('/ventas', ventasRoutes)

  

  // 3. ESCUCHAR EL SERVIDOR
  app.listen(port, () => {
    console.log(`Servidor levantado en puerto ${port}`)
  })

  
 

  
  
}

main()

