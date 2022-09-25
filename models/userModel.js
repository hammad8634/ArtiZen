const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Must be greater then 3 chars'],
    maxlength: [50, 'Must be less then 50 chars'],
    required: [true, 'Must have a name'],
  },
  email: {
    type: String,
    required: [true, 'must have an email'],
    unique: [true, 'must be unique'],
    lowercase: true,
    validate: [validator.isEmail, 'Enter a valid email'],
  },
  // username: {
  //   type: String,
  //   required: [true, 'must have a username'],
  //   unique: [true, 'username must be unique'],
  // },
  phoneNumber: {
    type: String,
    required: [true, 'must have a phone number'],
    unique: [true, 'must be unique'],
    // validate: [validator.isPhoneNumber, 'Enter a phone number'],
  },
  password: {
    type: String,
    minlength: [8, 'Must be greater or equal to 8'],
    required: [true, 'Must have a password'],
  },
  passwordConfirm: {
    type: String,

    required: [true, 'Must have a confirm password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not same',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'unverified'],
    default: 'unverified',
  },
  temprole: {
    type: String,
    default: 'user',
  },
  passResetToken: String,
  passTokenExpire: Date,
  active: {
    type: Boolean,
    default: true,
  },
  confirmEmailToken: String,
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

UserSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });

  next();
});

// UserSchema.methods.correctPassword = async function (candPass, userPass) {
//   return await bcrypt.compare(candPass, userPass);
// };

UserSchema.methods.correctPassword = async function (
  candPassword,
  userPassword
) {
  return await bcrypt.compare(candPassword, userPassword);
};

UserSchema.methods.ChangedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimeStamp < changedTimeStamp;
  }
};

UserSchema.methods.passwordResetToken = function () {
  const ResetToken = crypto.randomBytes(32).toString('hex');

  this.passResetToken = crypto
    .createHash('sha256')
    .update(ResetToken)
    .digest('hex');

  this.passTokenExpire = Date.now() + 10 * 60 * 1000;

  return ResetToken;
};

UserSchema.methods.emailResetToken = function () {
  const emailConfirm = crypto.randomBytes(32).toString('hex');

  this.confirmEmailToken = crypto
    .createHash('sha256')
    .update(emailConfirm)
    .digest('hex');

  return emailConfirm;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
