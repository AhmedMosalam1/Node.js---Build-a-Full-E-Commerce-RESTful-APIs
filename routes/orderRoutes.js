const express = require('express');
const order = require('../controllers/orderController.js')
const authController = require('../controllers/authController.js')
//const brandValidator = require('../utils/validators/brandValidator.js')
const router = express.Router();

router.use(authController.protect)



router.get('/', authController.allowedTo("user", "admin"), order.filterOrderForLoggedUser, order.findAllOrders)

router.get('/:id', authController.allowedTo("user"), order.findSpecificOrder)

router.get("/checkout-session/:cartId",authController.allowedTo("user"),order.checkoutSession)

router.post("/:cartId", authController.allowedTo("user"), order.createCashOrder)

router.patch("/:id/pay",authController.allowedTo("admin"),order.updateOrderToPaid)

router.patch("/:id/deliver",authController.allowedTo("admin"),order.updateOrderToDelivered)

module.exports = router