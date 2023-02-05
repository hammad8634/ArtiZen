const mongoose = require('mongoose');
// const { double } = require('webidl-conversions');

const productSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Must have name of Product'],
      unique: [true, 'Name must not be used before'],
    },

    photos: { type: [String], required: [true, 'must have photos'] },
    video: { type: String, required: [true, 'must have video'] },
    category: { type: String, required: [true, 'must have category'] },
    subcategory: { type: [String], required: [true, 'must have subcategory'] },

    ratingAvg: {
      type: Number,
      default: 4.3,
    },
    ratingTotal: {
      type: Number,
      default: 0,
    },

    soldItems: {
      type: Number,
      required: [true, 'must have number of sold items'],
    },
    originalPrice: { type: Number, required: [true, 'must have price'] },

    salePrice: {
      discountedPercentage: Number,
      discountedPrice: Number,
    },

    Description: { type: String, required: [true, 'must have Description'] },

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
