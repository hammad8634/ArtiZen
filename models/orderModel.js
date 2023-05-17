const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Buyer',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
        productPrice: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    orderno: {
      type: String,
      unique: true,
      default: function () {
        return `${new Array(4)
          .fill(0)
          .map((_) => Math.floor(Math.random() * 10))
          .join('')}`;
      },
    },

    location: {
      cityName: {
        type: String,
        required: [true, 'Must have name of city'],
      },
      address: {
        type: String,
        required: [true, 'must enter location name'],
      },
    },
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered'],
      default: 'Pending',
    },

    paymentStatus: {
      type: String,
      enum: ['Done', 'Pending'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
