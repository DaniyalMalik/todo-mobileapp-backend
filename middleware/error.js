const Response = require('../models/Response');
const StatusCode = require('../models/StatusCode');

const errorHandler = (err, req, res, next) => {
  const response = new Response();

  console.log(err.stack.red);

  response.setServerError(err);

  const { ...responseObj } = response;

  res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
};

module.exports = errorHandler;
