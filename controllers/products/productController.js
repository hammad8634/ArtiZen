const Store = require('../../models/sellerStoreModel');
const AppError = require('../../utils/appError');
const Product = require('../../models/productsModel');
const catchAsync = require('../../utils/catchAsync');
const Factory = require('../factoryHandler');
const axios = require('axios').default;

// const Seller = require('../../models/sellerModel');

exports.createProduct = catchAsync(async (req, res, next) => {
  req.body.owner = req.user.id;

  const { productName, Description } = req.body;

  try {
    const moderationResponse = await axios.post(
      'http://35.223.95.232:8080/v1/moderate',
      {
        title: productName,
        text: Description,
      }
    );
    console.log(`Moderation Response 1 : ${moderationResponse}`);
    console.log('Success 1');

    if (moderationResponse.data.inappropriate) {
      return res.status(406).json({
        status: 'Error',
        message: 'The product contains inappropriate content.',
      });
    }

    const store = await Store.findOne({ owner: { $eq: req.user.id } });
    req.body.store = store.id;
    const product = await Product.create(req.body);

    axios
      .post('http://35.223.95.232:8080/v1/update-product-model', {
        product_id: product.id,
      })
      .then(() => {
        console.log(`Product id sent is: ${product.id}`);
      })
      .catch((error) => {
        console.log(
          `Failed to send the newly created product ID:, ${error}\n and Product Id; ${product.id}`
        );
      });

    res.status(201).json({
      status: 'Success',
      message: 'Product Created!',
      product,
    });
    console.log('Product created successfully.');
  } catch (err) {
    return res.status(401).send({
      message: `Error message for create product end is: ${err?.message}`,
    });
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
