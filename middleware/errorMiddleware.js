const ApiError = require("../utils/appError")

const handleJsonWebTokenError = () => {
    return new ApiError('invalid token. please log in again!', 401)
}

const handleTokenExpiredError = () => {
    return new ApiError('your token has expired. please log in again', 401)
}

const GlobalError = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"

    if (process.env.NODE_ENV === "development") {
        return sendErrorForDev(err, res)
    }
    else {
        if (err.name === 'JsonWebTokenError') err = handleJsonWebTokenError()
        if (err.name === 'TokenExpiredError') err = handleTokenExpiredError()
        return sendErrorForProd(err, res)
    }
}

const sendErrorForDev = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack // stack => where error occurred
    })
}

const sendErrorForProd = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })
}

module.exports = GlobalError