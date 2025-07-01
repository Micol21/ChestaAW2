import { Router } from "express"
import mongoose from "mongoose"
import Venta from "../db/schemas/venta.schema.js"
import connectToDatabase from "../db/connection.js"
import { syncToJsonFile } from '../utils/syncFile.js'
import path from 'path'

const router = Router()

// POST: Crear nueva venta
router.post('/create', async (req, res) => {
  const { id_usuario, fecha, total, direccion, productos } = req.body;

  try {
    await connectToDatabase();

    const nuevaVenta = await Venta.create({
      id_usuario,
      fecha: fecha || new Date().toISOString().slice(0, 10),
      total,
      direccion,
      productos
    });

    // Sincronizar ventas.json
    const ruta = path.resolve('./data/ventas.json')
    await syncToJsonFile(ruta, Venta)

    res.status(201).json({
      mensaje: "Venta registrada exitosamente",
      venta: nuevaVenta
    });
  } catch (error) {
    console.error("Error al registrar la venta:", error.message)
  res.status(500).json({ mensaje: "Error al registrar la venta", error: error.message });
  }
})

// PUT: Actualizar venta
router.put('/:id', async (req, res) => {
  const id = req.params.id
  const nuevosDatos = req.body

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ mensaje: "ID no válido" })
  }

  try {
    await connectToDatabase()
    const ventaActualizada = await Venta.findByIdAndUpdate(id, nuevosDatos, { new: true })

    if (ventaActualizada) {
      const ruta = path.resolve('./data/ventas.json')
      await syncToJsonFile(Venta, ruta)

      res.status(200).json({
        mensaje: "Venta actualizada correctamente",
        venta: ventaActualizada
      })
    } else {
      res.status(404).json({ mensaje: "Venta no encontrada" })
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar la venta", error })
  }
})

// DELETE: Eliminar venta
router.delete('/:id', async (req, res) => {
  const id = req.params.id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ mensaje: "ID no válido" })
  }

  try {
    await connectToDatabase()
    const result = await Venta.findByIdAndDelete(id)

    if (result) {
      const ruta = path.resolve('./data/ventas.json')
      await syncToJsonFile(Venta, ruta)

      res.status(200).json({ mensaje: "Venta eliminada correctamente" })
    } else {
      res.status(404).json({ mensaje: "Venta no encontrada" })
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la venta", error })
  }
})

export default router
