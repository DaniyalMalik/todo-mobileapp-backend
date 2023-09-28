const Admin = require('../../models/Admin'),
  User = require('../../models/User'),
  Response = require('../../models/Response'),
  StatusCode = require('../../models/StatusCode');

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

// Get all users with pagination
exports.getAllUsersWithPagination = async (req, res, next) => {
  const response = new Response();
  const { page, limit, search = '' } = req.query;
  const offset = +page == 1 ? 0 : (+page - 1) * +limit;

  try {
    const promises = [];

    promises.push(
      User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } },
        ],
      })
        .sort('-createdAt')
        .skip(+offset)
        .limit(+limit),
    );
    promises.push(
      User.countDocuments({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } },
        ],
      }),
    );

    const result = await Promise.all(promises);

    response.setSuccessAndData({ users: result[0], usersCount: result[1] });

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  } catch (error) {
    console.log(error);

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

// Get all users without pagination
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
