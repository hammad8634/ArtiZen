const mongoose = require('mongoose');

const storeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Must have name'],
    },
    photo: String,
    category: String,
    subcategory: String,
    color: {
      type: String,
    },
    location: {
      coordinates: [Number],
      address: {
        type: String,
        required: [true, 'must enter location name'],
      },
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'Seller',
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

storeSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'owner',
    select: 'name',
  });
  next();
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
