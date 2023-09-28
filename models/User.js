const mongoose = require('mongoose'),
  bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken'),
  crypto = require('crypto');

const MongooseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: [true, 'Email address already exists!'],
      // required: [true, "User's email address is required!"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter a valid email address!',
      ],
    },
    phoneNumber: {
      type: String,
      unique: [true, 'Phone number already exists!'],
      // required: [true, "User's phone number is required!"],
      default: '',
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordTokenExpiry: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true },
);

MongooseSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});

MongooseSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, isAdmin: false }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

MongooseSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

MongooseSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordTokenExpiry = Date.now() + 10 * 60 * 1000;
  this.save({ validateBeforeSave: false });

  return resetToken;
};

MongooseSchema.methods.getVerifyEmailToken = function () {
  const resetToken = crypto.randomBytes(4).toString('hex');

  this.verifyEmailToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.verifyEmailTokenExpiry = Date.now() + 10 * 60 * 1000;
  this.save({ validateBeforeSave: false });

  return resetToken;
};

MongooseSchema.methods.getVerifyMessageToken = function () {
  const resetToken = crypto.randomBytes(4).toString('hex');

  this.verifyMessageToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.verifyMessageTokenExpiry = Date.now() + 10 * 60 * 1000;
  this.save({ validateBeforeSave: false });

  return resetToken;
};

module.exports = mongoose.model('User', MongooseSchema, 'User');
