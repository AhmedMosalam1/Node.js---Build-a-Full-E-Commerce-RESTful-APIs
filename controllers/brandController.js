const Brand = require("../models/brandModel")
const handle = require('./handelrFactory')
const multer = require("multer")
const sharp = require("sharp")
const asyncHandler = require('express-async-handler');

const { uploadSingleImage } = require("../middleware/uploadImageMiddleware")

exports.resizeImage = asyncHandler(async(req,res,next) => {
    const filename = `brand-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/brand/${filename}`);
  
    // Save image into our db
    req.body.image = filename;
  
    next();
})

exports.uploadBrandImage = uploadSingleImage('image')

// @access  public
exports.getAllBrand = handle.getAll(Brand)

// @access  private
exports.createBrand = handle.createOne(Brand)

exports.getBrand = handle.getOne(Brand)

exports.deleteBrand = handle.deleteOne(Brand)

exports.deleteAllBrand = handle.deleteAll(Brand)

exports.updateBrand = handle.updateOne(Brand)