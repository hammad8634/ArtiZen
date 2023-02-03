const Store = require('../../models/sellerStoreModel');
// const AppError = require('../../utils/appError');
const Product = require('../../models/productsModel');
const catchAsync = require('../../utils/catchAsync');
// const Seller = require('../../models/sellerModel');

exports.createProduct = catchAsync(async (req, res, next) => {
  req.body.owner = req.user.id;
  // req.body.name = req.user.name;

  const store = await Store.findOne({ owner: { $eq: req.user.id } });

  req.body.store = store.id;
  const product = await Product.create(req.body);

  res.status(201).json({
    status: 'Success',
    message: 'Product Created!',
    product,
  });
});

exports.getallproducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    status: 'Success',
    product: products || `No Product Found`,
  });
});
