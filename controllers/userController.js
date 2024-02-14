const User = require("../models/userModel")
const handle = require('./handelrFactory')
const multer = require("multer")
const sharp = require("sharp")
const asyncHandler = require('express-async-handler');

const bcrypt = require('bcryptjs');

const ApiError = require('../utils/appError');

const { uploadSingleImage } = require("../middleware/uploadImageMiddleware")

exports.uploadUserImage = uploadSingleImage('profileImg')

exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `user-${Date.now()}.jpeg`;
    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/user/${filename}`);

        // Save image into our db
        req.body.profileImg = filename;

    }


    next();
})

// @access  public
exports.getAllUser = handle.getAll(User)

// @access  private
exports.createUser = handle.createOne(User)

exports.getUser = handle.getOne(User)

exports.deleteUser = handle.deleteOne(User)

exports.deleteAllUser = handle.deleteAll(User)

exports.updateUser = asyncHandler(async (req, res, next) => {
    if (req.body.password) {
        return next(new ApiError("this route is not for password update . please use /updatepassword", 404))
    }
    const document = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            slug: req.body.slug,
            phone: req.body.phone,
            email: req.body.email,
            profileImg: req.body.profileImg,
            role: req.body.role,
        },
        {
            new: true,
        }
    );

    if (!document) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(
        req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true,
        }
    );

    if (!document) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
});


exports.getMe = (req, res, next) => {
    req.params.id = req.user._id
    next()
}

exports.changeMyPassword = asyncHandler(async (req, res, next) => {
     // 1) Update user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // 2) Generate token
  const token = user.generateToken(user._id)

  res.status(200).json({
    status: "success",
    data: {
      data: user
    },
    token
  })
})

exports.updateMyData = asyncHandler(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      },
      { new: true }
    );
  
    res.status(200).json({
        status: "success",
        data: {
          data: updatedUser
        }
      })
  });

  exports.deleteMe = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });

    res.status(204).json({
        status: 'success',
    });
});