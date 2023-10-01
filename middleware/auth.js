const jwt = require('jsonwebtoken'),
  Response = require('../models/Response'),
  StatusCode = require('../models/StatusCode');

module.exports = (req, res, next) => {
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

    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);

    if (error.message === 'jwt expired') {
      response.setTokenExpired(error.message);
    } else {
      response.setServerError(error.message);
    }

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};
