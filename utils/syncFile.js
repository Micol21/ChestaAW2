import { writeFile } from 'fs/promises'

export const syncToJsonFile = async (filePath, dataSource) => {
  try {
    let dataArray = []

    
    if (typeof dataSource?.toArray === 'function') {
      dataArray = await dataSource.toArray()
    }

    
    else if (Array.isArray(dataSource)) {
      dataArray = dataSource
    }

    
    else if (typeof dataSource?.find === 'function') {
      dataArray = await dataSource.find().lean()
    }

    else {
      throw new Error("Tipo de dato no compatible para sincronización")
    }

    await writeFile(filePath, JSON.stringify(dataArray, null, 2))
    console.log(`Archivo ${filePath} actualizado correctamente`)
  } catch (error) {
    console.error(`Error al sincronizar archivo ${filePath}:`, error.message)
    throw error
  }
}
