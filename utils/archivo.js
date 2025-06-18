

import { readFile } from 'fs/promises'

export const buscarPorIdEnArchivo = async (rutaArchivo, id) => {
  const file = await readFile(rutaArchivo, 'utf-8')
  const data = JSON.parse(file)
  return data.find(e => e.id == id)
}




