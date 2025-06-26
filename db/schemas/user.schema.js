import mongoose from "mongoose"
const { Schema, model, models } = mongoose

const UserSchema = new Schema({
  name: String,
  lastname: String,
  username: String,
  pass: String,
  id: Number
})

const User = models.user || model("user", UserSchema)
export default User
