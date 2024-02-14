import mongoose from 'mongoose'
import Joi from 'joi'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 20,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    }
})

export const User = mongoose.model('User', userSchema)

export function validateUser(user){
    const schema = Joi.object({
        username: Joi.string().min(6).max(20).alphanum().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(20).required()
    })

    return schema.validate(user)
}

 