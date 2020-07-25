import * as mongoose from 'mongoose'

export interface UserModel extends mongoose.Document {
  type: string
  name: string
  email: string
  password?: string
}

export const UserSchema = new mongoose.Schema({
  type: { type: String, required: true },
  name: String,
  email: { type: String, required: true },
  password: String,
})
