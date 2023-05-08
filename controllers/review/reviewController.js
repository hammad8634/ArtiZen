const Review = require('../../models/reviewModel');
const catchAsync = require('../../utils/catchAsync');
const factory = require('../factoryHandler');

exports.setProductUser = catchAsync(async (req, res, next) => {
  // if (!req.body.product) req.body.product = req.params.id;
  // if (!req.body.user) req.body.user = req.user.id;
  req.body.product = req.params.id;
  req.body.user = req.user.id;
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

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
