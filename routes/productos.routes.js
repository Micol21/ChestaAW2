import { Router } from "express"
import { createProd } from "../db/actions/product.actions.js"
import Venta from '../db/schemas/venta.schema.js'
import mongoose from 'mongoose'
import Product from '../db/schemas/product.schema.js'
import connectToDatabase from '../db/connection.js'
import { syncToJsonFile } from '../utils/syncFile.js'
import path from 'path'
import { readFile } from 'fs/promises'

const router = Router()

// POST: Crear producto y sincronizar archivo
router.post('/create', async (req, res) => {
  const { name, desc, price, stock, categoria } = req.body

  try {
    const result = await createProd(name, desc, price, stock, categoria)

    
    const db = await connectToDatabase()
    const ruta = path.resolve('./data/productos.json')
    await syncToJsonFile(ruta, db.collection('productos'))

    console.log("Producto creado:", result)
    res.status(200).json({
      mensaje: "Producto creado correctamente",
      producto: result
    })
  } catch (error) {
    console.error("Error en /create:", error)
    res.status(500).json({ error: error.message || "Error interno" })
  }
})

// GET: Listar productos desde archivo
router.get('/', async (req, res) => {
  try {
    const ruta = path.resolve('./data/productos.json')
    const file = await readFile(ruta, 'utf-8')
    const productos = JSON.parse(file || '[]')

    res.json(productos)
  } catch (error) {
    console.error('Error al leer productos.json:', error)
    res.status(500).json({ status: false, mensaje: 'Error al obtener productos' })
  }
})

// GET: Filtrar por categoría (Mongo)
router.get('/categoria/:categoria', async (req, res) => {
  const categoria = req.params.categoria.trim()

  try {
    await connectToDatabase()
    const productos = await Product.find({
      categoria: { $regex: new RegExp(`^${categoria}$`, "i") }
    })

    if (productos.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron productos en esta categoría' })
    }

    res.status(200).json(productos)
  } catch (error) {
    console.error("Error al buscar productos por categoría:", error)
    res.status(500).json({ mensaje: 'Error en la búsqueda', error })
  }
})

// GET: Buscar por ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json('ID no válido')
    }

    const producto = await Product.findById(id)

    if (producto) {
      res.status(200).json(producto)
    } else {
      res.status(404).json('Producto no encontrado')
    }
  } catch (error) {
    res.status(500).json('Error al obtener producto')
  }
})

// PUT: Actualizar precio y sincronizar archivo
router.put('/:id', async (req, res) => {
  const id = req.params.id
  const nuevoPrecio = req.body.price

  try {
    await connectToDatabase()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: 'ID no válido' })
    }

    const productoActualizado = await Product.findByIdAndUpdate(
      id,
      { price: nuevoPrecio },
      { new: true }
    )

    if (productoActualizado) {
      // Sincronizar archivo
      const db = await connectToDatabase()
      const ruta = path.resolve('./data/productos.json')
      await syncToJsonFile(ruta, db.collection('productos'))

      res.status(200).json({
        mensaje: 'Precio actualizado correctamente',
        producto: productoActualizado
      })
    } else {
      res.status(404).json({ mensaje: 'Producto no encontrado' })
    }
  } catch (error) {
    console.error("Error detallado:", error)
    res.status(500).json({ mensaje: 'Error al actualizar el precio', error })
  }
})

// DELETE: Eliminar producto y sincronizar archivo
router.delete('/delete/:productoID', async (req, res) => {
  const producto_ID = req.params.productoID

  try {
    await connectToDatabase()

    if (!mongoose.Types.ObjectId.isValid(producto_ID)) {
      return res.status(400).json('ID de producto no válido')
    }

    const productoEnVenta = await Venta.findOne({
      productos: { $elemMatch: { id_producto: Number(producto_ID) } }
    })

    if (productoEnVenta) {
      return res.status(400).json('No se puede eliminar: producto asociado a una venta')
    }

    const resultado = await Product.findByIdAndDelete(producto_ID)

    if (resultado) {
      
      const db = await connectToDatabase()
      const ruta = path.resolve('./data/productos.json')
      await syncToJsonFile(ruta, db.collection('productos'))

      res.status(200).json('Producto eliminado correctamente')
    } else {
      res.status(404).json('No se pudo encontrar el producto')
    }
  } catch (error) {
    console.error(error)
    res.status(500).json('Error al eliminar producto')
  }
})

export default router

