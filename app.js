const helmet = require('helmet');
const sanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('./routes/userRoute');
const AppError = require('./utils/appError');
const globalErrHandler = require('./controllers/errorController');

dotenv.config({ path: './config.env' });

const app = express();

app.use(cors());

app.options('*', cors());

app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: ' To many requests to the API please try again after an hour',
});

app.use(sanitize());

app.use(xss());

app.use('/api', limiter);

app.use(express.json({ limit: '20kb' }));

app.use(compression());

app.use((req, res, next) => {
  req.requestBody = new Date().toISOString();
  next();
});

// routes
app.use('/api1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find the provided route: ${req.originalUrl}`));
});

app.use(globalErrHandler);

module.exports = app;
