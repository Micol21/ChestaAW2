import { readFile } from 'fs/promises'

export const get_user_byId = async (id) => {
  const file = await readFile('./data/productos.json', 'utf-8')
  const userData = JSON.parse(file)
  return userData.find(e => e.id == id)
}


