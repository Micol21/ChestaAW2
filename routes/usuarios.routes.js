import { Router } from "express"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
import User from "../db/schemas/user.schema.js"
import connectToDatabase from "../db/connection.js"
import { syncToJsonFile } from '../utils/syncFile.js'
import path from 'path'
import { readFile } from 'fs/promises'

dotenv.config()

const router = Router()

// POST: Login
router.post('/login', async (req, res) => {
  const { username, pass } = req.body 

  try {
    await connectToDatabase()

    const user = await User.findOne({ username }) 

    if (!user) {
      return res.status(404).json({ status: false, mensaje: 'Usuario no encontrado' })
    }

    const controlPass = bcrypt.compareSync(pass, user.pass)
    if (!controlPass) {
      return res.status(401).json({ status: false, mensaje: 'Contraseña incorrecta' })
    }

    const token = jwt.sign(
      {
        name: user.name,
        lastname: user.lastname,
        username: user.username,
        id: user.id
      },
      process.env.SECRET,
      { expiresIn: 86400 } 
    )

    const userSinPass = {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      username: user.username
    }

    res.status(200).json({ status: true, token, user: userSinPass })

  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ status: false, mensaje: error.message })
  }
})

// PUT: Actualizar contraseña
router.put('/:id', async (req, res) => {
  try {
    const mongoID = req.params.id
    const nuevaPass = req.body.pass
    const hashedPass = bcrypt.hashSync(nuevaPass, 8)

    await connectToDatabase()

    const usuario = await User.findByIdAndUpdate(
      mongoID,
      { pass: hashedPass },
      { new: true }
    )

    if (usuario) {
      const db = await connectToDatabase()
      const ruta = path.resolve('./data/users.json')
      await syncToJsonFile(ruta, db.collection('users'))

      res.status(200).json({ mensaje: 'Contraseña actualizada correctamente', usuario })
    } else {
      res.status(404).json({ mensaje: 'Usuario no encontrado' })
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar contraseña', error })
  }
})

// POST: Registro
router.post('/register', async (req, res) => {
  const { name, lastname, username, pass } = req.body

  if (!name || !lastname || !username || !pass) {
    return res.status(400).json({ mensaje: "Faltan datos para registrar el usuario." })
  }

  try {
    await connectToDatabase()

    const existe = await User.findOne({ username })
    console.log("Usuario encontrado:", existe)
    if (existe) {
      return res.status(409).json({ mensaje: "El nombre de usuario ya está en uso." })
    }

    const hashedPass = bcrypt.hashSync(pass, 8)

    // Obtener el último ID existente
    const ultimo = await User.findOne().sort({ id: -1 }).limit(1)
    const nuevoID = ultimo ? ultimo.id + 1 : 101

    const nuevoUsuario = await User.create({
      name,
      lastname,
      username,
      pass: hashedPass,
      id: nuevoID
    })

    const db = await connectToDatabase()
    const ruta = path.resolve('./data/users.json')
    const todosLosUsuarios = await User.find()
    await syncToJsonFile(ruta, todosLosUsuarios) 

    res.status(201).json({ mensaje: "Usuario registrado exitosamente", usuario: nuevoUsuario })
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar el usuario", error })
  }
})

// DELETE: Eliminar usuario por ID
router.delete('/:id', async (req, res) => {
  try {
    await connectToDatabase()

    const mongoID = req.params.id
    const usuarioEliminado = await User.findByIdAndDelete(mongoID)

    if (!usuarioEliminado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' })
    }

    const db = await connectToDatabase()
    const ruta = path.resolve('./data/users.json')
    await syncToJsonFile(ruta, db.collection('users'))

    res.status(200).json({ mensaje: 'Usuario eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el usuario', error })
  }
})

// GET: Listar usuarios desde archivo JSON (sin contraseña)
router.get('/json', async (req, res) => {
  try {
    const ruta = path.resolve('./data/users.json')
    const file = await readFile(ruta, 'utf-8')
    const users = JSON.parse(file || '[]')

    const usersSinPass = users.map(({ pass, ...rest }) => rest)

    res.status(200).json(usersSinPass)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al leer users.json', error })
  }
})

export default router
