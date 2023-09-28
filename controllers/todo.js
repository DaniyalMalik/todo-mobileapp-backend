const Response = require('../models/Response'),
  StatusCode = require('../models/StatusCode'),
  mongoose = require('mongoose'),
  User = require('../models/User'),
  sendEmail = require('../utils/sendEmail'),
  Response = require('../models/Response'),
  StatusCode = require('../models/StatusCode'),
  crypto = require('crypto');

// Update user
exports.updateUser = async (req, res, next) => {
  const response = new Response();

  try {
    const { name, location } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, location },
      {
        new: true,
        useFindAndModify: false,
      },
    );

    response.setSuccessAndDataWithMessage(
      { user },
      'User updated successfully!',
    );

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  } catch (error) {
    console.log(error);

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

// Get user
exports.getUser = async (req, res, next) => {
  const response = new Response();

  try {
    const user = await User.findById(req.params.id);

    response.setSuccessAndData({ user });

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  } catch (error) {
    console.log(error);

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

// Get all users
exports.getAllUsersList = async (req, res, next) => {
  const response = new Response();

  try {
    const users = await User.find().sort('name');

    response.setSuccessAndData({ users });

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  } catch (error) {
    console.log(error);

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

// Register a user
exports.register = async (req, res, next) => {
  const response = new Response();

  try {
    const { name, phoneNumber, password } = req.body;

    if (!phoneNumber) {
      response.setError('Phone number is required!');

      const { ...responseObj } = response;

      return res
        .status(StatusCode.getStatusCode(responseObj))
        .json(responseObj);
    }

    if (!password) {
      response.setError('Password is required!');

      const { ...responseObj } = response;

      return res
        .status(StatusCode.getStatusCode(responseObj))
        .json(responseObj);
    }

    const checkUserExists = await User.findOne({
      phoneNumber,
    });

    if (checkUserExists) {
      response.setError('Phone number already exists!');

      const { ...responseObj } = response;

      return res
        .status(StatusCode.getStatusCode(responseObj))
        .json(responseObj);
    }

    const user = await User.create({ name, phoneNumber, password });
    // const resetToken = await user.getVerifyEmailToken();
    // const resetUrl = `${resetToken}`;
    // const message = `Enter the Following reset code in your mobile app: \n${resetUrl}`;

    // await sendEmail({
    //   email: user.email,
    //   subject: 'Verification Code',
    //   message,
    // });

    response.setSuccess('User successfully registered!');

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  } catch (error) {
    console.log(error);

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

// Login a user
exports.login = async (req, res, next) => {
  const response = new Response();

  try {
    const { phoneNumber, password } = req.body;
    let user = await User.findOne({ phoneNumber }).select('+password');

    if (!user) {
      response.setError('User does not exist!');

      const { ...responseObj } = response;

      return res
        .status(StatusCode.getStatusCode(responseObj))
        .json(responseObj);
    }

    const isSame = await user.matchPassword(password);

    if (!isSame) {
      response.setUnAuthorized('Invalid Credentials!');

      const { ...responseObj } = response;

      return res
        .status(StatusCode.getStatusCode(responseObj))
        .json(responseObj);
    }

    const token = user.getSignedJwtToken();

    user = await User.findOne({ phoneNumber });

    response.setSuccessAndDataWithMessage({ user, token }, 'User logged in!');

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  } catch (error) {
    console.log(error);

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

// Login using social account
exports.socialLogin = async (req, res, next) => {
  const response = new Response();

  try {
    const userPayload = req.body;

    if (!userPayload.socialLoginToken) {
      response.setError('Social login token is required!');

      const { ...responseObj } = response;

      return res
        .status(StatusCode.getStatusCode(responseObj))
        .json(responseObj);
    }

    let user = await User.findOne({ email: userPayload.email });

    if (user) {
      await User.findByIdAndUpdate(
        user._id,
        {
          socialLoginToken: userPayload.socialLoginToken,
        },
        { useFindAndModify: false },
      );

      const token = user.getSignedJwtToken();

      response.setSuccessAndDataWithMessage({ user, token }, 'User logged in!');

      const { ...responseObj } = response;

      res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
    } else {
      userPayload.isEmailVerified = true;

      const user = await User.create(userPayload);
      const token = user.getSignedJwtToken();

      response.setSuccessAndDataWithMessage({ user, token }, 'User logged in!');

      const { ...responseObj } = response;

      res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
    }
  } catch (error) {
    console.log(error);

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

// Get current logged in user
exports.getMe = async (req, res, next) => {
  const response = new Response();

  try {
    const user = await User.findById(req.user.id);

    response.setSuccessAndData({ user });

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  } catch (error) {
    console.log(error);

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

// Update current logged in user
exports.updateMe = async (req, res, next) => {
  const response = new Response();

  try {
    const toUpd = req.body;

    if (toUpd.email) {
      const checkUserExists = await User.find({
        email: toUpd.email,
      });

      if (checkUserExists) {
        response.setError('Email address already exists!');

        const { ...responseObj } = response;

        return res
          .status(StatusCode.getStatusCode(responseObj))
          .json(responseObj);
      }
    } else if (toUpd.phoneNumber) {
      const checkUserExists = await User.find({
        phoneNumber: toUpd.phoneNumber,
      });

      if (checkUserExists) {
        response.setError('Phone number already exists!');

        const { ...responseObj } = response;

        return res
          .status(StatusCode.getStatusCode(responseObj))
          .json(responseObj);
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, toUpd, {
      new: true,
      useFindAndModify: false,
    });

    response.setSuccessAndDataWithMessage(
      { user },
      'User updated successfully!',
    );

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  } catch (error) {
    console.log(error);

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

// Forgot password token
exports.forgotPassword = async (req, res, next) => {
  const response = new Response();
  const { id, type = 0 } = req.body;
  const user = await User.findById(id);

  try {
    if (type == 0) {
      // through email

      if (!user) {
        response.setError('User does not exist!');

        const { ...responseObj } = response;

        return res
          .status(StatusCode.getStatusCode(responseObj))
          .json(responseObj);
      }

      const resetToken = await user.getResetPasswordToken();
      const resetUrl = `${resetToken}`;
      const message = `Enter the Following reset code in your mobile app: \n${resetUrl}`;

      // await sendEmail({
      //   email: user.email,
      //   subject: 'Verification Code',
      //   message,
      // });

      response.setSuccess(`Email to ${user.email} has been sent!`);

      const { ...responseObj } = response;

      res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
    } else if (type == 1) {
      // through message

      if (!user) {
        response.setError('User does not exist!');

        const { ...responseObj } = response;

        return res
          .status(StatusCode.getStatusCode(responseObj))
          .json(responseObj);
      }

      const resetToken = await user.getResetPasswordToken();
      const resetUrl = `${resetToken}`;
      const message = `Enter the Following reset code in your mobile app: \n${resetUrl}`;

      // await sendEmail({
      //   email: user.email,
      //   subject: 'Verification Code',
      //   message,
      // });

      response.setSuccess(`Message to ${user.phoneNumber} has been sent!`);

      const { ...responseObj } = response;

      res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
    }
  } catch (error) {
    console.log(error);

    user.resetPasswordToken = '';
    user.resetPasswordTokenExpiry = '';

    await user.save({ validateBeforeSave: false });

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
  const response = new Response();

  try {
    const { phoneNumber, password } = req.body;
    const user = await User.findOne({
      phoneNumber,
    });

    if (!user) {
      response.setError('User not found!');

      const { ...responseObj } = response;

      return res
        .status(StatusCode.getStatusCode(responseObj))
        .json(responseObj);
    }

    user.password = password;

    await user.save();

    response.setSuccess('Password has been changed successfully!');

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  } catch (error) {
    console.log(error);

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

exports.changePassword = async (req, res, next) => {
  const response = new Response();

  try {
    const updUser = req.body,
      oldUser = await User.findById(req.user.id).select('password'),
      matchPassword = await oldUser.matchPassword(updUser.oldPassword);

    if (!matchPassword) {
      response.setError('Old password is incorrect!');

      const { ...responseObj } = response;

      return res
        .status(StatusCode.getStatusCode(responseObj))
        .json(responseObj);
    }

    oldUser.password = updUser.newPassword;

    const user = await oldUser.save();

    if (!user) {
      response.setError('Password could not be updated!');

      const { ...responseObj } = response;

      return res
        .status(StatusCode.getStatusCode(responseObj))
        .json(responseObj);
    }

    response.setSuccess('Password Updated!');

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  } catch (error) {
    console.log(error);

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};
