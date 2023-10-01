const Response = require('../models/Response'),
  StatusCode = require('../models/StatusCode'),
  User = require('../models/User');

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

    response.setServerError(error.message);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

// Update current logged in user
exports.updateMe = async (req, res, next) => {
  const response = new Response();

  try {
    const updUser = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updUser,
      {
        new: true,
        useFindAndModify: false,
      },
    );

    response.setSuccessAndDataWithMessage(
      { user },
      'Updated successfully!',
    );

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  } catch (error) {
    console.log(error);

    response.setServerError(error.message);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};
