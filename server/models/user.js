import mongoose from 'mongoose'
import Joi from 'joi'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
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
    },
    profilePicture: {
        type: String,
        default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png'
    }
})

export const User = mongoose.model('User', userSchema)

export function validateUser(user){
    const schema = Joi.object({
        username: Joi.string().alphanum().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })

    return schema.validate(user)
}

 