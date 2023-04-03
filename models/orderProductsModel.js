const mongoose = require('mongoose');

const orderProductSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Buyer',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seller',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },

    orderno: {
      type: String,
      required: true,
    },
    quantity: { type: Number, required: true },
    productPrice: { type: Number, required: true },

    // totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const OrderProduct = mongoose.model('orderProduct', orderProductSchema);

module.exports = OrderProduct;
