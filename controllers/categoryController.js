const Category = require("../models/categoryModel")
const ApiError = require("../utils/appError")
const asyncHandler = require('express-async-handler');
const handle = require('./handelrFactory')
const multer = require("multer")
const sharp = require("sharp")

const  { uploadSingleImage } = require("../middleware/uploadImageMiddleware")




exports.resizeImage = asyncHandler(async(req,res,next) => {
    const filename = `category-${Date.now()}.jpeg`;
  if(req.file){
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/category/${filename}`);
  
    // Save image into our db
    req.body.image = filename;
  }
    
  
    next();
})

exports.uploadCategoryImage = uploadSingleImage('image')

// @access  public
exports.getAllCategory = handle.getAll(Category)

// @access  private
exports.createCategory = handle.createOne(Category)

exports.getCategory = handle.getOne(Category)

exports.deleteCategory = handle.deleteOne(Category)

exports.deleteAllCategory = handle.deleteAll(Category)

exports.updateCategory = handle.updateOne(Category)









