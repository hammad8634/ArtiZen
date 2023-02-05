const Store = require('../../models/sellerStoreModel');
const AppError = require('../../utils/appError');
const Product = require('../../models/productsModel');
const catchAsync = require('../../utils/catchAsync');
const Factory = require('../factoryHandler');
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

exports.updateProducts = catchAsync(async (req, res, next) => {
  const products = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  if (products) {
    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
    });
  } else {
    return next(
      new AppError("Can't Update product. As No Product found with such id")
    );
  }
});

exports.deleteProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findByIdAndDelete(req.params.id);
  if (products) {
    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  } else {
    return next(
      new AppError("Can't Delete Product. As No Product found with such id")
    );
  }
});

exports.getoneproduct = Factory.getOne(Product);
