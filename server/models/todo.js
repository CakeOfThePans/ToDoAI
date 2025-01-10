import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true
    },
    task: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        required: false
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    order: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    endDate: {
        type: Date
    },
    startDate: {
        type: Date
    },
    scheduled: {
        type: Boolean,
        required: true,
        default: false
    }
})

export const Todo = mongoose.model('Todo', todoSchema)