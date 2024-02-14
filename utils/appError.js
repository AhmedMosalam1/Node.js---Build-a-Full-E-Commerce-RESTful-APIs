// @desc this is class for (error can i predict)

class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        // Error.captureStackTrace(this, this.constructor)
    }
}


module.exports = ApiError  