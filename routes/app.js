const categoryRoutes = require('./categoryRoutes')
const subCategoryRoutes = require("./subCategoryRoutes")
const brandRoutes = require('./brandRoutes')
const productRoutes = require('./productRoutes')
const userRoutes = require('./userRoutes')
const authRoutes = require('./authRoutes')
const reviewRoutes = require('./reviewRoutes')
const wishlistRoutes = require('./wishListRoutes')
const addressRoutes = require('./addressRoutes')
const couponRoutes = require('./couponRoutes')
const cartRoutes = require('./cartRoutes')
const orderRoutes = require('./orderRoutes')




const mountRoutes = (app) => {
    app.use('/api/category', categoryRoutes);
    app.use('/api/subcategory', subCategoryRoutes);
    app.use('/api/brand', brandRoutes);
    app.use('/api/product', productRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/review', reviewRoutes);
    app.use('/api/wishlist', wishlistRoutes);
    app.use('/api/address', addressRoutes);
    app.use('/api/coupon', couponRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/order', orderRoutes);

}


module.exports = mountRoutes