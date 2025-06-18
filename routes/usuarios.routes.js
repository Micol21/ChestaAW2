import { Router } from "express";
import { readFile, writeFile } from 'fs/promises';

const router = Router();

// Función asincrónica para leer el archivo y devolver el array de usuarios
const getUserData = async () => {
  try {
    const file = await readFile('./data/users.json', 'utf-8');
    return JSON.parse(file || '[]');
  } catch (err) {
    console.error("Error al leer users.json:", err.message);
    return []; // En caso de error, devuelve un array vacío
  }
};

// Ruta POST /login
router.post('/login', async (req, res) => {
  const { userName, pass } = req.body;

  const userData = await getUserData();

  const result = userData.find(e => e.username === userName && e.pass === pass);

  if (result) {
    const data = {
      name: result.name,
      lastName: result.lastname,
      userName: result.username,
      status: true
    };
    res.status(200).json(data);
  } else {
    res.status(400).json({ status: false });
  }
});

// PUT: Actualizar contraseña de un usuario por ID
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const nuevaPass = req.body.pass;

    const usuarios = await getUserData();
    const index = usuarios.findIndex(u => u.id === id);

    if (index !== -1) {
      usuarios[index].pass = nuevaPass;
      await writeFile('./data/users.json', JSON.stringify(usuarios, null, 2));
      res.status(200).json({ mensaje: 'Contraseña actualizada correctamente', usuario: usuarios[index] });
    } else {
      res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar contraseña', error });
  }
});


// POST: Registro de nuevo usuario
router.post('/register', async (req, res) => {
  const { name, lastname, username, pass } = req.body;

  if (!name || !lastname || !username || !pass) {
    return res.status(400).json({ mensaje: "Faltan datos para registrar el usuario." });
  }

  try {
    const usuarios = await getUserData();

    // Verificar si ya existe el username
    const existe = usuarios.some(user => user.username === username);

    if (existe) {
      return res.status(409).json({ mensaje: "El nombre de usuario ya está en uso." });
    }

    // Crear nuevo usuario con ID automático
    const nuevoUsuario = {
      name,
      lastname,
      username,
      pass,
      id: usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 101
    };

    usuarios.push(nuevoUsuario);
    await writeFile('./data/users.json', JSON.stringify(usuarios, null, 2));

    res.status(201).json({ mensaje: "Usuario registrado exitosamente", usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar el usuario", error });
  }
});

export default router;
