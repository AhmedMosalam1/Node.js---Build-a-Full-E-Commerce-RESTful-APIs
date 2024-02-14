const express = require('express');
const subCategory = require('../controllers/subCategoryController.js')
const authController = require('../controllers/authController.js')
const subCategoryValidator = require('../utils/validators/subCategoryValidator')

//merge ==> allow us to access and use parameters on other routes 
const router = express.Router({mergeParams:true});

router.route('/')
    .get(subCategory.createFilterObj,subCategory.getAllSubCategory) // ==> nested routes
    .post(authController.protect,authController.allowedTo("admin"),subCategory.setCategoryId,subCategoryValidator.createSubCategoryValidator, subCategory.createSubCategory)
    .delete(authController.protect,authController.allowedTo("admin"),subCategory.deleteAllSubCategory)

router.route('/:id')
    //rules
    .get(subCategoryValidator.getSubCategoryValidator,subCategory.getSubCategory )
    .patch(authController.protect,authController.allowedTo("admin"),subCategoryValidator.updateSubCategoryValidator, subCategory.updateSubCategory)
    .delete(authController.protect,authController.allowedTo("admin"),subCategoryValidator.deleteSubCategoryValidator,subCategory.deleteSubCategory)

 
module.exports = router