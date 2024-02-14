const ApiError = require("../utils/appError")
const sendEmail = require("../utils/sendEmail")
const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken")
const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const { promisify } = require('util')

const User = require("../models/userModel")
const { sanitizeUser } = require("../utils/sanitizeData")

exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body)

  const token = user.generateToken(user._id)

  res.status(201).json({
    status: "success",
    data: {
      data: sanitizeUser(user)
    },
    token
  })

})

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Invalid Email or Password", 404))
  }

  const token = user.generateToken(user._id)

  res.status(200).json({
    status: "success",
    data: {
      data: sanitizeUser(user)
    },
    token
  })

})

exports.protect = asyncHandler(async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  //  else if (req.cookies.jwt) {
  //   token = req.cookies.jwt
  // }
  if (!token) {
    return next(new ApiError('you are not logged in! please log in to get access'), 401)
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY)

  // 3) Check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        'The user that belong to this token does no longer exist',
        401
      )
    );
  }

  if (currentUser.changePassword(decoded.iat)) {
    return next(new ApiError("User recently changed password! log in again", 401))
  }
  req.user = currentUser

  next()
})

exports.allowedTo = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("you  do not have permission to perform this action", 403));
    }
    next()
  })
}

exports.forgetPassword = asyncHandler(async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new ApiError(`there is no user from this ${req.body.email}`, 404));
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save()

  // 3) Send the reset code via email

  const message = `Hi ${user.name},\n
   We received a request to reset the password on your E-shop Account. \n
    ${resetCode} \n Enter this code to complete the reset. \n
     Thanks for helping us keep your account secure.\n
      The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset code (valid for 10 min)',
      message,
    });
  } catch (err) {

    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError(`There is an error in sending email ${err} `, 500));
  }
  res.status(200).json({
    status: 'Success',
    message: 'Reset code sent to email'
  });
})

exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError('Reset code invalid or expired'));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: 'Success'
  });
})

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404)
    );
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError('Reset code not verified', 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token = user.generateToken(user._id)
  res.status(200).json({
    status: "success",
    token
  })
});