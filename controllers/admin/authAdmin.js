const mongoose = require('mongoose'),
  Admin = require('../../models/Admin'),
  sendEmail = require('../../utils/sendEmail'),
  Response = require('../../models/Response'),
  StatusCode = require('../../models/StatusCode'),
  crypto = require('crypto');

// Register an admin
exports.register = async (req, res, next) => {
  const response = new Response();

  try {
    const admin = await Admin.create(req.body);

    response.setSuccessAndDataWithMessage(
      'Admin successfully registered!',
      admin,
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

// Login an admin
exports.login = async (req, res, next) => {
  const response = new Response();

  try {
    const { email, password } = req.body;
    let admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      response.setError('Admin does not exist!');

      const { ...responseObj } = response;

      return res
        .status(StatusCode.getStatusCode(responseObj))
        .json(responseObj);
    }

    const isSame = await admin.matchPassword(password);

    if (!isSame) {
      response.setUnAuthorized('Invalid Credentials!');

      const { ...responseObj } = response;

      return res
        .status(StatusCode.getStatusCode(responseObj))
        .json(responseObj);
    }

    const token = admin.getSignedJwtTokenAdmin();
    const options = {
      //   maxAge: new Date(
      //     Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
      //   ),
      // SameSite: 'none',
      httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }

    admin = await Admin.findOne({ email });

    response.setSuccessAndDataWithMessage({ admin }, 'Admin logged in!');

    const { ...responseObj } = response;

    res
      .cookie('token', token, options)
      .status(StatusCode.getStatusCode(responseObj))
      .json(responseObj);
  } catch (error) {
    console.log(error);

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

// Logout a admin
exports.logout = async (req, res, next) => {
  const response = new Response();

  try {
    const options = {
      //   maxAge: new Date(
      //     Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
      //   ),
      httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }

    response.setSuccess('Logged out!');

    const { ...responseObj } = response;

    res
      .cookie('token', '', options)
      .status(StatusCode.getStatusCode(responseObj))
      .json(responseObj);
  } catch (error) {
    console.log(error);

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

// Get current logged in admin
exports.getMe = async (req, res, next) => {
  const response = new Response();

  try {
    const admin = await Admin.findById(req.admin.id);

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

// Update current logged in admin
exports.updateMe = async (req, res, next) => {
  const response = new Response();

  try {
    const { name, phoneNumber, email } = req.body;
    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      { name, phoneNumber, email },
      { new: true, useFindAndModify: false },
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

// Forgot password token
exports.forgotPassword = async (req, res, next) => {
  const response = new Response();
  const admin = await Admin.findOne({ email: req.query.email });

  try {
    if (!admin) {
      response.setError(`No admin with the email: ${req.query.email} found!`);

      const { ...responseObj } = response;

      return res
        .status(StatusCode.getStatusCode(responseObj))
        .json(responseObj);
    }

    const resetToken = await admin.getResetPasswordToken();
    const resetUrl = `${resetToken}`;
    const message = `Enter the Following reset code in your mobile app: \n${resetUrl}`;

    // await sendEmail({
    //   email: admin.email,
    //   subject: 'Verification Code',
    //   message,
    // });

    response.setSuccess(`Email to ${admin.email} has been sent!`);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  } catch (error) {
    console.log(error);

    admin.resetPasswordToken = '';
    admin.resetPasswordTokenExpiry = '';

    await admin.save({ validateBeforeSave: false });

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
  const response = new Response();

  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.body.resetToken)
      .digest('hex');
    const admin = await Admin.findOne({
      resetPasswordToken,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!admin) {
      response.setError('Invalid Token!');

      const { ...responseObj } = response;

      return res
        .status(StatusCode.getStatusCode(responseObj))
        .json(responseObj);
    }

    admin.password = req.body.password;
    admin.resetPasswordToken = '';
    admin.resetPasswordTokenExpiry = '';

    await admin.save();

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
    const updAdmin = req.body,
      oldAdmin = await Admin.findById(req.admin.id).select('password'),
      matchPassword = await oldAdmin.matchPassword(updAdmin.oldPassword);

    if (!matchPassword) {
      response.setError('Old password is incorrect!');

      const { ...responseObj } = response;

      return res
        .status(StatusCode.getStatusCode(responseObj))
        .json(responseObj);
    }

    oldAdmin.password = updAdmin.newPassword;

    const admin = await oldAdmin.save();

    if (!admin) {
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
