const { check,body } = require('express-validator')
const slugify = require("slugify")
const validatorMiddleware = require('../../middleware/validatorMiddleware')

exports.getSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid SubCategory Id'),
    validatorMiddleware
];

exports.createSubCategoryValidator = [
    check('name')
    .notEmpty().withMessage('SubCategory Name Must be Required')
    .isLength({min:2}).withMessage('Name at least 3 characters')
    .isLength({max:32}).withMessage('Too Long SubCategory Name'),
    check('category').notEmpty().withMessage("SubCategory must be has parent Category")
    .isMongoId().withMessage('Invalid Category Id')
    .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      }),
    validatorMiddleware

]

exports.updateSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid SubCategory Id'),
    body('name').optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      }),
    validatorMiddleware
]

exports.deleteSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid SubCategory Id'),
    validatorMiddleware
]