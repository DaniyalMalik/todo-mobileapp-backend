const mongoose = require('mongoose');

const MongooseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required!"],
        },
        description: {
            type: String,
            required: [true, "Description is required!"],
        },
        done: {
            type: Boolean,
            default: false
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "User's id is required!"],
          },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Todo', MongooseSchema, 'Todo');
