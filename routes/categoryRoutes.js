const express = require('express');
const category = require('../controllers/categoryController.js')
const categoryValidator = require('../utils/validators/categoryValidator.js')
const subCategoryRoutes = require("./subCategoryRoutes.js")
const authController = require('../controllers/authController.js')
const router = express.Router();


router.use("/:categoryId/subcategory", subCategoryRoutes)

router.route('/')
    .get(category.getAllCategory)
    .post(authController.protect,authController.allowedTo("admin"),category.uploadCategoryImage,category.resizeImage,categoryValidator.createCategoryValidator, category.createCategory)
    .delete(authController.protect,authController.allowedTo("admin"),category.deleteAllCategory)
   

router.route('/:id')
    //rules
    .get(categoryValidator.getCategoryValidator, category.getCategory)
    .patch(authController.protect,authController.allowedTo("admin"),category.uploadCategoryImage,category.resizeImage,categoryValidator.updateCategoryValidator, category.updateCategory)
    .delete(authController.protect,authController.allowedTo("admin"),categoryValidator.deleteCategoryValidator, category.deleteCategory)


module.exports = router