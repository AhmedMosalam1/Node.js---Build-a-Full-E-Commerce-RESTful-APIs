const path = require('path');

require("dotenv").config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const Limit = require("express-rate-limit")
const hpp = require('hpp');
const mongoSanitizer = require('express-mongo-sanitize');
const xss = require('xss-clean');



const db = require('./config/database')

const ApiError = require('./utils/appError')
const GlobalError = require("./middleware/errorMiddleware")

const mountRoutes = require('./routes/app')

// Connection Database
db()

//Express app
const app = express();

app.use(cors())
app.options("*",cors())

app.use(compression())


//Middleware
app.use(express.json({limit:"25kb"}))
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(mongoSanitizer())
app.use(xss())
///limit request
const limiter = Limit({
    max: 50,
    windowMs: 15 * 60 * 1000, //15 minute
    message: "too many requests from this ip , please try again in an hour"
  })
  
  app.use('/api',limiter);

  //middleware to protect against HTTP Parameters Pollution attacks
  app.use(
    hpp({
      whitelist: [
        'price',
        'sold',
        'quantity',
        'ratingsAverage',
        'ratingsQuantity',
      ],
    })
  );


//Routes
mountRoutes(app)

app.all('*', (req, res, next) => {

    next(new ApiError(`Can't find ${req.originalUrl} on this server`, 400));
})


//Global Erroe Handling Middleware
app.use(GlobalError)


const port = process.env.PORT || 8000
const server = app.listen(port, () => {
    console.log('server running')
})


//Catch Error Outsied Express and Control it(Handle)
//Event ==> Listen ==> Callback(err)

process.on('unhandledRejection', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(`${err.name}  ||  ${err.message}`);
    server.close(() => {
        process.exit(1)
    })
})