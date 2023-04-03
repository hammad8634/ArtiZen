const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
      default: `Order: ${new Array(4)
        .fill(0)
        // eslint-disable-next-line no-unused-vars
        .map((_) => Math.floor(Math.random() * 10))
        .join('')}`,
    },
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
