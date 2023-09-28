const Response = require('../models/Response'),
  StatusCode = require('../models/StatusCode'),
  User = require('../models/User');

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
    const { name, location } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
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
