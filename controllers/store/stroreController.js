const Store = require('../../models/sellerStoreModel');
const AppError = require('../../utils/appError');
const Seller = require('../../models/sellerModel');
const catchAsync = require('../../utils/catchAsync');

exports.createStore = catchAsync(async (req, res, next) => {
  req.body.owner = req.user.id;

  const store = await Store.create(req.body);

  res.status(201).json({
    status: 'Success',
    message: 'Store Created!',
    store,
  });
});
