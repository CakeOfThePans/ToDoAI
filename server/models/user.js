import mongoose from 'mongoose'
import Joi from 'joi'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  defaultList: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List'
  }
})

export const User = mongoose.model('User', userSchema)

export function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(4).max(20).alphanum().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
  })

  return schema.validate(user)
}
