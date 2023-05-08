const mongoose = require('mongoose');
const Product = require('./productsModel');
const catchAsync = require('../utils/catchAsync');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "can't be empty"],
    },
    rating: {
      type: Number,
      max: [5, 'below or eqaul 5'],
      min: [1, 'above 0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Must belong to Product'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'Buyer',
      required: [true, 'Must belong to user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name photo',
  // }).populate({
  //   path: 'tour',
  //   select: 'name',
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAvrgRating = async function (prodId) {
  const stats = await this.aggregate([
    {
      $match: { product: prodId },
    },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avrgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(prodId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avrgRating,
    });
  } else {
    await Product.findByIdAndUpdate(prodId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAvrgRating(this.product);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAvrgRating(this.r.product);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
