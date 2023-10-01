const Response = require('../models/Response'),
    StatusCode = require('../models/StatusCode'),
    User = require('../models/User');

// Register a user
exports.register = async (req, res, next) => {
    const response = new Response();

    try {
        const payload = req.body;
        const user = await User.create(payload);
        const token = user.getSignedJwtToken();

        response.setSuccessAndDataWithMessage({ user, token }, 'Successfully registered!');

        const { ...responseObj } = response;

        res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
    } catch (error) {
        console.log(error);

        response.setServerError(error.message);

        const { ...responseObj } = response;

        res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
    }
};

// Login a user
exports.login = async (req, res, next) => {
    const response = new Response();

    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email }).select('+password');

        if (!user) {
            response.setError('User does not exist!');

            const { ...responseObj } = response;

            return res
                .status(StatusCode.getStatusCode(responseObj))
                .json(responseObj);
        }

        const isSame = await user.matchPassword(password);

        if (!isSame) {
            response.setUnAuthorized('Invalid Credentials!');

            const { ...responseObj } = response;

            return res
                .status(StatusCode.getStatusCode(responseObj))
                .json(responseObj);
        }

        const token = user.getSignedJwtToken();

        user = await User.findOne({ email });

        response.setSuccessAndDataWithMessage({ user, token }, 'Successfully logged in!');

        const { ...responseObj } = response;

        res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
    } catch (error) {
        console.log(error);

        response.setServerError(error.message);

        const { ...responseObj } = response;

        res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
    }
};

// Login using social account
exports.socialLogin = async (req, res, next) => {
    const response = new Response();

    try {
        const userPayload = req.body;

        if (!userPayload.socialLoginToken) {
            response.setError('Social login token is required!');

            const { ...responseObj } = response;

            return res
                .status(StatusCode.getStatusCode(responseObj))
                .json(responseObj);
        }

        let user = await User.findOne({ email: userPayload.email });

        if (user) {
            await User.findByIdAndUpdate(
                user._id,
                {
                    socialLoginToken: userPayload.socialLoginToken,
                },
                { useFindAndModify: false },
            );

            const token = user.getSignedJwtToken();

            response.setSuccessAndDataWithMessage({ user, token }, 'Successfully logged in!');

            const { ...responseObj } = response;

            res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
        } else {
            userPayload.isEmailVerified = true;

            const user = await User.create(userPayload);
            const token = user.getSignedJwtToken();

            response.setSuccessAndDataWithMessage({ user, token }, 'Successfully logged in!');

            const { ...responseObj } = response;

            res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
        }
    } catch (error) {
        console.log(error);

        response.setServerError(error.message);

        const { ...responseObj } = response;

        res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
    }
};

// Change password
exports.changePassword = async (req, res, next) => {
    const response = new Response();

    try {
        const { newPassword, oldPassword } = req.body,
            oldUser = await User.findById(req.user.id).select('password'),
            matchPassword = await oldUser.matchPassword(oldPassword);

        if (!matchPassword) {
            response.setError('Old password is incorrect!');

            const { ...responseObj } = response;

            return res
                .status(StatusCode.getStatusCode(responseObj))
                .json(responseObj);
        }

        oldUser.password = newPassword;

        const user = await oldUser.save();

        if (!user) {
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

        response.setServerError(error.message);

        const { ...responseObj } = response;

        res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
    }
};
