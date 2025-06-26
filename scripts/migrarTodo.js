import { readFile } from 'fs/promises'
import connectToDatabase from '../db/connection.js'

import Product from '../db/schemas/product.schema.js'
import User from '../db/schemas/user.schema.js'
import Venta from '../db/schemas/venta.schema.js'

const migrarTodo = async () => {
  try {
    await connectToDatabase()

    
    const productosRaw = await readFile('./data/productos.json', 'utf-8')
    const productos = JSON.parse(productosRaw).map(p => {
    return {
    name: p.nombre,
    desc: p.desc,
    price: p.precio,
    imagen: p.imagen
  }
})
await Product.insertMany(productos)
console.log('Productos migrados ')

   
    const usersRaw = await readFile('./data/users.json', 'utf-8')
    const users = JSON.parse(usersRaw)
    await User.insertMany(users)
    console.log('Usuarios migrados ')

   
    const ventasRaw = await readFile('./data/ventas.json', 'utf-8')
    const ventas = JSON.parse(ventasRaw).map(v => {
    const { id, ...resto } = v
    return resto
    })
    await Venta.insertMany(ventas)
    console.log('Ventas migradas ')

    process.exit(0)
  } catch (error) {
    console.error('Error durante migración:', error)
    process.exit(1)
  }
}

migrarTodo()
