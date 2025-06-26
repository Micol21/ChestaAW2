import mongoose from "mongoose"
const { Schema, model, models } = mongoose

const VentaSchema = new Schema({
  id_usuario: Number,
  fecha: String,
  total: Number,
  direccion: String,
  productos: [
    {
      id_producto: Number,
      cantidad: Number
    }
  ]
})

const Venta = models.venta || model("venta", VentaSchema)
export default Venta
