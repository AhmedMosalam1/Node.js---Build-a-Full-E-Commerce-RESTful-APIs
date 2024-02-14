const express = require('express');
const brand = require('../controllers/brandController.js')
const authController = require('../controllers/authController.js')
const brandValidator = require('../utils/validators/brandValidator.js')
const router = express.Router();


router.route('/')
    .get(brand.getAllBrand)
    .post(authController.protect,authController.allowedTo("admin"),brand.uploadBrandImage,brand.resizeImage,brandValidator.createBrandValidator,brand.createBrand)
    .delete(authController.protect,authController.allowedTo("admin"),brand.deleteAllBrand)

router.route('/:id')
    //rules
    .get(brandValidator.getBrandValidator, brand.getBrand)
    .patch(authController.protect,authController.allowedTo("admin"),brand.uploadBrandImage,brand.resizeImage,brandValidator.updateBrandValidator, brand.updateBrand)
    .delete(authController.protect,authController.allowedTo("admin"),brandValidator.deleteBrandValidator, brand.deleteBrand)


module.exports = router