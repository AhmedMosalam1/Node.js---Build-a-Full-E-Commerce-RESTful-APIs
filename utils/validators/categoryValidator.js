const { check, body } = require('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')
const slugify = require('slugify');

exports.getCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Category Id'),
    validatorMiddleware
];

exports.createCategoryValidator = [
    check('name')
    .notEmpty().withMessage('Category Name Must be Required')
    .isLength({min:3}).withMessage('Name at least 3 characters')
    .isLength({max:32}).withMessage('Too Long Category Name')
    .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      })
    ,validatorMiddleware
]

exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Category Id'),
    body('name').optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      }),
    validatorMiddleware
]

exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Category Id'),
    validatorMiddleware
]