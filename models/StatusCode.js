const statusCodes = require('../utils/constants');

class StatusCodeModel {
  static getStatusCode(responseObject) {
    if (responseObject.isSuccess) {
      return statusCodes.success;
    } else if (responseObject.isUnAuthorized) {
      return statusCodes.unAuthorized;
    } else if (responseObject.isNotFound) {
      return statusCodes.notFound;
    }
    else if (responseObject.isServerError) {
      return statusCodes.server;
    } else {
      return statusCodes.badRequest;
    }
  }
}

module.exports = StatusCodeModel;
