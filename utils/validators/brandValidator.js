const { check,body } = require('express-validator')
const slugify = require('slugify');
const validatorMiddleware = require('../../middleware/validatorMiddleware')

exports.getBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand Id'),
    validatorMiddleware
];

exports.createBrandValidator = [
    check('name')
    .notEmpty().withMessage('Brand Name Must be Required')
    .isLength({min:3}).withMessage('Name at least 3 characters')
    .isLength({max:32}).withMessage('Too Long Brand Name')
    .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      })
    ,validatorMiddleware
]

exports.updateBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand Id'),
    body('name').optional().custom((val, { req }) => { // if replace body with check is working normally
        req.body.slug = slugify(val);
        return true;
      }),
    validatorMiddleware
]

exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand Id'),
    validatorMiddleware
]