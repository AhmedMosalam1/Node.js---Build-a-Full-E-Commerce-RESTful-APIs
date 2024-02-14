const Product = require("../models/productModel")
const handle = require('./handelrFactory')

const multer = require('multer')
const sharp = require('sharp')
const asyncHandler = require('express-async-handler');

const  { uploadMixOfImages } = require("../middleware/uploadImageMiddleware")



exports.uploadProductImages = uploadMixOfImages([
    {
      name: 'imageCover',
      maxCount: 1,
    },
    {
      name: 'images',
      maxCount: 5,
    },
  ]);
  
  exports.resizeProductImages = asyncHandler(async (req, res, next) => {
    // console.log(req.files);
    //1- Image processing for imageCover
    if (req.files.imageCover) {
      const imageCoverFileName = `product-${Date.now()}-cover.jpeg`;
  
      await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/product/${imageCoverFileName}`);
  
      // Save image into our db
      req.body.imageCover = imageCoverFileName;
    }
    //2- Image processing for images
    if (req.files.images) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (img, index) => {
          const imageName = `product-${Date.now()}-${index + 1}.jpeg`;
  
          await sharp(img.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/product/${imageName}`);
  
          // Save image into our db
          req.body.images.push(imageName);
        })
      );
  
      next();
    }
  });

// @access  public
exports.getAllProduct = handle.getAll(Product,'Products')

// @access  private
exports.createProduct = handle.createOne(Product)

exports.getProduct = handle.getOne(Product,'reviews')

exports.deleteProduct = handle.deleteOne(Product)

exports.deleteAllProduct = handle.deleteAll(Product)

exports.updateProduct = handle.updateOne(Product)