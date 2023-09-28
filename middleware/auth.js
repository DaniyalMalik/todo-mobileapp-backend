const jwt = require('jsonwebtoken'),
  Response = require('../models/Response'),
  StatusCode = require('../models/StatusCode');

exports.protect = (req, res, next) => {
  const response = new Response();
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    response.setUnAuthorized('You are not authorized to access this route!');

    const { ...responseObj } = response;

    return res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.isAdmin) {
      response.setUnAuthorized('You are not authorized to access this route!');

      const { ...responseObj } = response;

      return res
        .status(StatusCode.getStatusCode(responseObj))
        .json(responseObj);
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);

    if (error.message === 'jwt expired') {
      response.setTokenExpired(error.message);
    } else if (error.message === 'invalid signature') {
      response.setUnAuthorized(error.message);
    } else {
      response.setServerError(error);
    }

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

exports.protectAdmin = (req, res, next) => {
  const response = new Response();
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    response.setUnAuthorized('You are not authorized to access this route!');

    const { ...responseObj } = response;

    return res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin) {
      response.setUnAuthorized('You are not authorized to access this route!');

      const { ...responseObj } = response;

      return res
        .status(StatusCode.getStatusCode(responseObj))
        .json(responseObj);
    }

    req.admin = decoded;

    next();
  } catch (error) {
    console.log(error);

    if (error.message === 'jwt expired') {
      response.setTokenExpired(error.message);
    } else if (error.message === 'invalid signature') {
      response.setUnAuthorized(error.message);
    } else {
      response.setServerError(error);
    }

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};
