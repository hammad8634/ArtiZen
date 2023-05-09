const Store = require('../../models/sellerStoreModel');
const AppError = require('../../utils/appError');
const Product = require('../../models/productsModel');
const catchAsync = require('../../utils/catchAsync');
const Factory = require('../factoryHandler');
// const Seller = require('../../models/sellerModel');

exports.createProduct = catchAsync(async (req, res, next) => {
  req.body.owner = req.user.id;
  // req.body.name = req.user.name;

  const { productName, Description } = req.body;

  // try {
  //   const moderationResponse = await axios.post('http://127.0.0.1:8000/v1/moderate', {
  //     "title":productName,
  //     "text":Description,
  //   });
  //   console.log(`Product name is: ${productName} and description is: ${description}`);

  //   if (moderationResponse.data.inappropriate) {
  //     return res.status(406).json({
  //       status: 'Error',
  //       message: 'The product contains inappropriate content.',
  //     });
  //   }

  try {
    const store = await Store.findOne({ owner: { $eq: req.user.id } });
    req.body.store = store.id;
    const product = await Product.create(req.body);

    axios

      .post('http://127.0.0.1:8000/v1/update_product_model', {
        productId: product.id,
        console: console.log(`New added product is : ${productId}`),
      })
      .catch((error) => {
        console.log('Failed to send the newly created product ID:', error);
      });

    res.status(201).json({
      status: 'Success',
      message: 'Product Created!',
      product,
    });
    console.log('Producted created successfully..........................');
  } catch (err) {
    res.status(401).send({ message: err?.message });
  }
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
