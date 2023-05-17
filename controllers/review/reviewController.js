const Review = require('../../models/reviewModel');
const catchAsync = require('../../utils/catchAsync');
const factory = require('../factoryHandler');
const Product = require('../../models/productsModel');
const Order = require('../../models/orderModel');

exports.setProductUser = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.user.id;

  const productExists = await Product.exists({ _id: productId });
  if (!productExists) {
    return res.status(404).json({
      status: 'Failing',
      message: 'Product not found.....',
    });
  }

  // Check if the user has placed an order for the product
  const orderExists = await Order.exists({
    'products.product': productId,
    user: userId,
  });
  console.log(`Order exist value: ${orderExists}`);
  // if (!orderExists) {
  //   return res.status(403).json({
  //     status: 'failed',
  //     message: 'You can only give reviews for products, you have ordered...',
  //   });
  // }

  req.body.product = productId;
  req.body.user = userId;
  // next();
  const review = await Review.create(req.body);
  console.log('reviews are: ', review);

  res.status(200).json({
    status: 'success',
    data: {
      reviews: review,
    },
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => { 
  try {
    const reviews = await Review.find();
console.log(`Reviews are: ${reviews.length}`);
    res.status(200).json({
      status: 'success',
      data: {
        reviews,
      },
    });
  } catch (error) {
    // Handle any errors that occur
    res.status(401).json({
      status: 'Failed',
      message: 'No Reviews found..',
    });
  }
});

// exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
