const Admin = require('../../models/Admin'),
  User = require('../../models/User'),
  Response = require('../../models/Response'),
  StatusCode = require('../../models/StatusCode');

// Create an admin
exports.createAdmin = async (req, res, next) => {
  const response = new Response();

  try {
    const adminPayload = req.body;
    const admin = await Admin.create(adminPayload);

    response.setSuccessAndDataWithMessage(admin, 'Admin successfully created');

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  } catch (error) {
    console.log(error);

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

// Update admin
exports.updateAdmin = async (req, res, next) => {
  const response = new Response();

  try {
    const { name, role } = req.body;
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { name, role },
      {
        new: true,
        useFindAndModify: false,
      },
    );

    response.setSuccessAndDataWithMessage(
      { admin },
      'Admin updated successfully!',
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

// Get admin
exports.getAdmin = async (req, res, next) => {
  const response = new Response();

  try {
    const admin = await Admin.findById(req.params.id);

    response.setSuccessAndData({ admin });

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  } catch (error) {
    console.log(error);

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

// Get all admins
exports.getAllAdmins = async (req, res, next) => {
  const response = new Response();
  const { page, limit, search = '' } = req.query;
  const offset = +page == 1 ? 0 : (+page - 1) * +limit;

  try {
    const promises = [];

    promises.push(
      Admin.find({
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
      Admin.countDocuments({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } },
        ],
      }),
    );

    const result = await Promise.all(promises);

    response.setSuccessAndData({ admins: result[0], adminsCount: result[1] });

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  } catch (error) {
    console.log(error);

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};
