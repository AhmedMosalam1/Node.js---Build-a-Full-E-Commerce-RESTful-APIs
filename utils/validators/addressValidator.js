const { check , param , body} = require('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')
const User = require("../../models/userModel")

exports.createAddressValidator = [
    check('alias')
    .notEmpty()
    .withMessage('alias is required')
    .custom((val, { req }) =>
    // Check if logged user create review before
    User.findOne({ _id: req.user._id, 'addresses.alias': req.body.alias }).then(
        (address) => {
           // console.log(review);
            if (address) {
                return Promise.reject(
                    new Error('You already created a same alias before')
                );
            }
        }
    )
),

    check('details')
    .notEmpty()
    .withMessage('details about address is required'),

    check('city')
    .notEmpty()
    .withMessage('city is required'),

    body('phone').custom((value) => {
        if (!/^\d{11}$/.test(value)) {
          throw new Error('Phone number must be an 11-digit number');
        }
        return true;
      }),

      body('postCode').custom((value) => {
        if (!/^\d{5}$/.test(value)) {
          throw new Error('Postal code in Egypt must be a 5-digit number');
        }
        return true;
      }),

    validatorMiddleware

]


exports.deleteAddressValidator = [
    param('addressId').isMongoId().withMessage('Invalid address Id'),
    validatorMiddleware
]