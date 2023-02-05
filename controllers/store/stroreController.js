const Store = require('../../models/sellerStoreModel');
const AppError = require('../../utils/appError');
const Product = require('../../models/productsModel');
const Seller = require('../../models/sellerModel');
const catchAsync = require('../../utils/catchAsync');
const Factory = require('../factoryHandler');

exports.createStore = catchAsync(async (req, res, next) => {
  req.body.owner = req.user.id;

  const prestore = await Store.findOne({ owner: { $eq: req.user.id } });

  // console.log(prestore);

  if (prestore)
    return next(
      new AppError(
        `${req.user.name} your store ${prestore.name} already exists! You can only Own 1 store`,
        400
      )
    );

  const store = await Store.create(req.body);

  res.status(201).json({
    status: 'Success',
    message: 'Store Created!',
    store,
  });
});

exports.getallstores = catchAsync(async (req, res, next) => {
  const stores = await Store.find();

  res.status(200).json({
    status: 'Success',
    store: stores || `No Store Found`,
  });
});

exports.deleteStoreanditsProducts = catchAsync(async (req, res, next) => {
  const prestore = await Store.findOne({ owner: req.user.id });

  if (!prestore)
    return next(
      new AppError(
        'You cannot delete this store. Only Owner can delete it!',
        401
      )
    );

  await Store.findByIdAndDelete(req.params.id);

  await Product.deleteMany({ store: { $in: [req.params.id] } });

  res.status(200).json({
    Success: 'Success',
    message: 'Store and Products Belonging to it Delete Successfully',
  });
});

exports.getonestore = Factory.getOne(Store, { path: 'products' });
