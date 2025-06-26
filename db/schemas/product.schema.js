import mongoose from "mongoose";
const { Schema, models, model } = mongoose;

const ProductSchema = new Schema({
  name: { type: String, required: true, unique: true },
  desc: { type: String, required: true },
  price: { type: String, required: true },
  stock: { type: String, default: 0 },
  categoria: { type: String, required: true } 
});

const Product = models.product || model('product', ProductSchema);

export default Product;

