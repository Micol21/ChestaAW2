import { Router } from "express"
import { readFile, writeFile } from 'fs/promises'
import { get_user_byId } from '../utils/user.js'

const router = Router()

// PUT: Actualizar precio
router.put('/precio/update/:productoID', async (req, res) => {
  try {
    const producto_ID = req.params.productoID
    const new_precio = req.body.precio

    const file = await readFile('./data/productos.json', 'utf-8')
    const productos = JSON.parse(file)

    const index = productos.findIndex(e => e.id == producto_ID)

    if (index !== -1) {
      productos[index].precio = new_precio
      await writeFile('./data/productos.json', JSON.stringify(productos, null, 2))
      res.status(200).json('Precio actualizado correctamente')
    } else {
      res.status(404).json('No se pudo encontrar el producto')
    }
  } catch (error) {
    res.status(500).json('Error al actualizar precio')
  }
})

// DELETE: Eliminar producto
router.delete('/delete/:productoID', async (req, res) => {
  try {
    const producto_ID = req.params.productoID

    const file = await readFile('./data/productos.json', 'utf-8')
    const productos = JSON.parse(file)

    const index = productos.findIndex(e => e.id == producto_ID)

    if (index !== -1) {
      productos.splice(index, 1)
      await writeFile('./data/productos.json', JSON.stringify(productos, null, 2))
      res.status(200).json('Producto eliminado correctamente')
    } else {
      res.status(404).json('No se pudo encontrar el producto')
    }
  } catch (error) {
    res.status(500).json('Error al eliminar producto')
  }
})

// GET: Buscar por ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const producto = await get_user_byId(id)

    if (producto) {
      res.status(200).json(producto)
    } else {
      res.status(404).json('Producto no encontrado')
    }
  } catch (error) {
    res.status(500).json('Error al obtener producto')
  }
})

export default router
