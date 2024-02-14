const SubCategory = require("../models/subCategoryModel")
const handle = require('./handelrFactory')

exports.createFilterObj = (req, res, next) => {
    let filterObj = {};
    if (req.params.productId) filterObj = { product: req.params.productId };
    req.filterObj = filterObj;
    next();
  };
//nesesd routes
exports.setCategoryId = (req,res,next) =>{
    if (!req.body.category){
        req.body.category = req.params.categoryId
    }
    next()
}
// @access  public
exports.getAllSubCategory = handle.getAll(SubCategory)

// @access  private
exports.createSubCategory = handle.createOne(SubCategory)

exports.getSubCategory = handle.getOne(SubCategory)

exports.deleteSubCategory = handle.deleteOne(SubCategory)

exports.deleteAllSubCategory = handle.deleteAll(SubCategory)

exports.updateSubCategory = handle.updateOne(SubCategory)