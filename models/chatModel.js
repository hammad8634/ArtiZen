const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: 'Seller',
    },
    buyer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Buyer',
    },
    sellerisSeen: {
      type: Boolean,
      default: false,
    },
    buyerisSeen: {
      type: Boolean,
      default: false,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    messages: [
      {
        senderId: String,
        name: String,
        message: { type: String },
        createdAt: { type: Date, default: Date.now() },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

chatSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'seller',
    select: 'name',
  });
  this.populate({
    path: 'buyer',
    select: 'name',
  });
  next();
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
