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
            required: [true, "Done is required!"],
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Todo', MongooseSchema, 'Todo');
