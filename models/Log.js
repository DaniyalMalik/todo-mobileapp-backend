const mongoose = require('mongoose'),
  { Schema } = mongoose,
  MongooseSchema = new Schema(
    {
      type: {
        type: Number,
        enum: [0, 1], // 0 => Message & 1 => Call
        required: [true, 'Type is required!'],
      },
      name: {
        type: String,
        required: [true, 'Name is required!'],
      },
      phoneNumber: {
        type: String,
        required: [true, 'Phone number is required!'],
      },
      message: {
        type: String,
        default: '',
      },
      responded: {
        type: Boolean,
        required: [true, 'Responded is required!'],
      },
      sessionId: {
        type: Schema.Types.ObjectId,
        ref: 'Session',
        required: [true, "Session's id is required!"],
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User's id is required!"],
      },
    },
    { timestamps: true },
  );

module.exports = mongoose.model('Log', MongooseSchema, 'Log');
