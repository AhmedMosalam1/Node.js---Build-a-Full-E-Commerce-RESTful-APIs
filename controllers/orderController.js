const stripe = require("stripe")(process.env.STRIPE_SECRET)

const asyncHandler = require('express-async-handler');
const factory = require('./handelrFactory');
const ApiError = require('../utils/appError');

const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');

// @desc    create cash order
// @route   POST /api/v1/orders/cartId
// @access  Protected/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
    );
  }

  // 2) Get order price depend on cart price "Check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create order with default paymentMethodType cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: { //main operation
        filter: { _id: item.product }, // firts sub-main operation
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }, // second sub-main operation  --- -(sub quanitity) +(add quantity) 
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status: 'success', data: order });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
    if (req.user.role === 'user') req.filterObj = { user: req.user._id };
    next();
  });

// @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Protected/User-Admin-Manager
exports.findAllOrders = factory.getAll(Order);

// @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Protected/User-Admin-Manager
exports.findSpecificOrder = factory.getOne(Order);

// @desc    Update order paid status to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Protected/Admin-Manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(
        new ApiError(
          `There is no such a order with this id:${req.params.id}`,
          404
        )
      );
    }
  
    // update order to paid
    order.isPaid = true;
    order.paidAt = Date.now();
  
    const updatedOrder = await order.save();
  
    res.status(200).json({ status: 'success', data: updatedOrder });
  });

// @desc    Update order delivered status
// @route   PUT /api/v1/orders/:id/deliver
// @access  Protected/Admin-Manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(
        new ApiError(
          `There is no such a order with this id:${req.params.id}`,
          404
        )
      );
    }
  
    // update order to paid
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  
    const updatedOrder = await order.save();
  
    res.status(200).json({ status: 'success', data: updatedOrder });
  });

  // @desc    Get checkout session from stripe and send it as response
// @route   GET /api/v1/orders/checkout-session/cartId
// @access  Protected/User
exports.checkoutSession = asyncHandler(async (req, res, next) => {
   // app settings
   const taxPrice = 0;
   const shippingPrice = 0;
 
   // 1) Get cart depend on cartId
   const cart = await Cart.findById(req.params.cartId);
   if (!cart) {
     return next(
       new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
     );
   }
 
   // 2) Get order price depend on cart price "Check if coupon apply"
   const cartPrice = cart.totalPriceAfterDiscount
     ? cart.totalPriceAfterDiscount
     : cart.totalCartPrice;
 
   const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

   // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [{
        price_data: {
          unit_amount: totalOrderPrice * 100,
          currency: 'egp',
          product_data: {
            name: req.user.name,
          },
        },
      quantity: 1,
  }],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/order`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // 4) send session to response
  res.status(200).json({ status: 'success', session });

});


const createCardOrder = async (session) => {
  try {
    const cartId = session.client_reference_id;
    const totalPrice = session.amount_total / 100;
    const cart = await Cart.findById(cartId);
    const user = await User.findOne({ email: session.customer_email });
    console.log(user);
    console.log(cart);
    // 3) Create order with payment method card
    const order = await Order.create({
      user: user._id,
      cartItems: cart.cartItems,
      totalOrderPrice: totalPrice,
      paymentMethod: "card",
      isPaid: true,
      paidAt: Date.now(),
    });
    // 4) Decrement product quantity, increment product sold
    if (order) {
      const bulkOptions = cart.cartItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
      }));
      await Product.bulkWrite(bulkOptions, {});
    }
    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(cartId);
  } catch (error) {
    console.log(error);
  }
};




// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    //  Create order
    await createCardOrder(event.data.object);
  }
  res.status(200).json({ recived: true });
});
