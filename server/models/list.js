import mongoose from 'mongoose'

const listSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        required: true
    },
    count: {
        type: Number,
        required: true,
        default: 0
    },
    color: {
        type: String,
        required: true
    }
})

export const List = mongoose.model('List', listSchema)