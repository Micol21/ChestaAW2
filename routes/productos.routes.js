import { Router } from "express"
import { readFile, writeFile } from 'fs/promises'
import { buscarPorIdEnArchivo } from '../utils/archivo.js'


const router = Router()


// GET: Listar todos los productos
router.get('/', async (req, res) => {
  try {
    const data = await readFile('./data/productos.json', 'utf-8')
    const productos = JSON.parse(data)
    res.status(200).json(productos)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los productos', error })
  }
})



// GET: Buscar por ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const producto = await buscarPorIdEnArchivo('./data/productos.json', id)

    if (producto) {
      res.status(200).json(producto)
    } else {
      res.status(404).json('Producto no encontrado')
    }
  } catch (error) {
    res.status(500).json('Error al obtener producto')
  }
})


// PUT: Actualizar precio
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const nuevoPrecio = req.body.precio

    const file = await readFile('./data/productos.json', 'utf-8')
    const productos = JSON.parse(file)

    const index = productos.findIndex(producto => producto.id == id)

    if (index !== -1) {
      productos[index].precio = nuevoPrecio
      await writeFile('./data/productos.json', JSON.stringify(productos, null, 2))
      res.status(200).json({ mensaje: 'Precio actualizado correctamente', producto: productos[index] })
    } else {
      res.status(404).json({ mensaje: 'Producto no encontrado' })
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el precio', error })
  }
})

//DELETE Eliminar producto 
router.delete('/delete/:productoID', async (req, res) => {
  try {
    const producto_ID = req.params.productoID

    // Leer productos
    const file = await readFile('./data/productos.json', 'utf-8')
    const productos = JSON.parse(file)

    // Leer ventas
    const ventasFile = await readFile('./data/ventas.json', 'utf-8')
    const ventas = JSON.parse(ventasFile)

    // Verificar si el producto está en alguna venta (estructura con objetos)
    const productoEnVenta = ventas.some(venta =>
      venta.productos &&
      venta.productos.some(p => p.id_producto == producto_ID)
    )

    if (productoEnVenta) {
      return res.status(400).json('No se puede eliminar el producto porque está asociado a una venta')
    }

    const index = productos.findIndex(e => e.id == producto_ID)

    if (index !== -1) {
      productos.splice(index, 1)
      await writeFile('./data/productos.json', JSON.stringify(productos, null, 2))
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
