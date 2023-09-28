const Response = require('../models/Response'),
  StatusCode = require('../models/StatusCode'),
  mongoose = require('mongoose'),
  User = require('../models/User'),
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
