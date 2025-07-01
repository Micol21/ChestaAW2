import mongoose from "mongoose"
const { Schema, model, models } = mongoose

const UserSchema = new Schema({
  name: String,
  lastname: String,
  username: { type: String, unique: true },
  pass: String,
  id: Number
})

const User = models.user || model("user", UserSchema)
export default User
