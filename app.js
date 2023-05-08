const logger = require('morgan');
const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');

const adminRouter = require('./routes/adminRoute');
const sellerRouter = require('./routes/sellerRoute');
const buyerRouter = require('./routes/buyerRoute');
const storeRouter = require('./routes/storeRoute');
const productRouter = require('./routes/productRoute');
const cartRouter = require('./routes/cartRoute');
const wishlistRouter = require('./routes/wishlistRoute');
const reviewRouter = require('./routes/reviewRoute');
const orderRouter = require('./routes/orderRoute');
const AppError = require('./utils/appError');
const globalErrHandler = require('./controllers/errorController');
const chatRouter = require('./routes/chatRoute');

dotenv.config({ path: './config.env' });

const app = express();

app.get('/hello-world', function (req, res, next) {
  res.send({ message: 'your project is working successfully!' });
});

app.use(cors());

app.get('/hello-world', function (req, res, next) {
  res.send({ message: 'your project is working successfully!' });
});

app.options('*', cors());

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req.requestBody = new Date().toISOString();
  next();
});

// routes
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/buyer', buyerRouter);
app.use('/api/v1/seller', sellerRouter);
app.use('/api/v1/store', storeRouter);
app.use('/api/v1/product', productRouter);

app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/wishlist', wishlistRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/chat', chatRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find the provided route: ${req.originalUrl}`));
});

app.use(globalErrHandler);

module.exports = app;
