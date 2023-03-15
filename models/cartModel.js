const mongoose = require('mongoose');
// const { double } = require('webidl-conversions');

const cartSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      // required: [true, 'Must have name of Product'],
      unique: [true, 'Name must not be used before'],
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity can not be less then 1.'],
    },
    salePrice: {
      discountedPercentage: Number,
      discountedPrice: Number,
      // required: true,
    },

    // total: {
    //   type: Number,
    //   required: true,
    // },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Buyer',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email',
  });
  next();
});
// cartSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'buyer',
//     select: 'productName',
//   });
//   next();
// });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
