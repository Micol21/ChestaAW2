import connectToDatabase from "../connection.js"
import Product from "../schemas/product.schema.js" // modelo de mongoose

const createProd = async (name, desc, price, stock, categoria) => {
  try {
    await connectToDatabase()
    const res = await Product.create({ name, desc, price, stock, categoria })
    return res
  } catch (error) {
    console.log("Error al crear producto:", error)
    throw error
  }
}

export { createProd }

