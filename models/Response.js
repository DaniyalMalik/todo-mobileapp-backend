class ResponseModel {
  data = {};
  isSuccess = false;
  isServerError = false;
  isUnAuthorized = false;
  isTokenExpired = false;
  message = '';
  serverError;

  setError(message) {
    this.isSuccess = false;
    this.message = message;
  }

  setSuccess(message) {
    this.isSuccess = true;
    this.message = message;
  }

  setSuccessAndDataWithMessage(data, message) {
    this.data = data;
    this.isSuccess = true;
    this.message = message;
  }

  setSuccessAndData(data) {
    this.data = data;
    this.isSuccess = true;
  }

  setServerError(ex) {
    this.isServerError = true;
    this.message = ex.message;
    this.serverError = ex;
  }

  setUnAuthorized(message) {
    this.isUnAuthorized = true;
    this.message = message;
  }

  setTokenExpired(message) {
    this.isUnAuthorized = true;
    this.isTokenExpired = true;
    this.message = message;
  }
}

module.exports = ResponseModel;
