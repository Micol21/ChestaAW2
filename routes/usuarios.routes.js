import { Router } from "express";
import { readFile } from 'fs/promises';

const router = Router();
let userData = [];

// Leer el archivo de usuarios al cargar el módulo
readFile('./data/users.json', 'utf-8')
  .then(data => {
    userData = JSON.parse(data || '[]');
  })
  .catch(error => {
    console.error("Error al leer users.json:", error.message);
  });

router.post('/login', (req, res) => {
  const { userName, pass } = req.body;

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

export default router;

