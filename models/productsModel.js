const mongoose = require('mongoose');
// const { double } = require('webidl-conversions');

const productSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Must have name of Product'],
      // unique: [true, 'Name must not be used before'],
    },

    productImages: {
      type: [String],
      required: [true, 'must have productImages'],
    },
    video: { type: String, required: [true, 'must have video'] },
    category: { type: String, required: [true, 'must have category'] },
    colors: {
      type: [String],
      required: [true, 'must have color'],
    },
    quantity: { type: Number, required: [true, 'must have quantity'] },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'must have rating above or equal 1'],
      max: [5, 'must have rating below or equal 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    soldItem: {
      type: Number,
      default: 0,
    },
    salePrice: {
      type: Number,
      required: [true, 'must have number of sale price'],
    },
    originalPrice: {
      type: Number,
      required: [true, 'must have original price'],
    },
    salePrice: {
      type: Number,
      required: [true, 'must have number of sale price'],
    },

    description: {
      type: String,
      required: [true, 'must have description'],
    },

    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'Seller',
    },

    store: {
      type: mongoose.Schema.ObjectId,
      ref: 'Store',
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'reviews',
  });
  next();
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'owner',
    select: 'name',
  });
  this.populate({
    path: 'store',
    select: '-owner name',
  });
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
