const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['local', 'google'],
    required: [true, 'Authentication method is not specified.'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  local: {
    name: {
      type: String,
      //required: [true, 'Your name is required.'],
      trim: true,
    },
    email: {
      type: String,
      require: [true, 'Please add you email address.'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: String,
    password: {
      type: String,
      //required: [true, 'Please provide a password'],
      minlength: 8,
      select: false, // Will not be shown in queries
    },
    passwordConfirm: {
      type: String,
      //required: [true, 'Please confirm your password'],
      // This only works on create and save
      /* validate: {
        validator(el) {
          return el === this.password;
        },
        message: 'Password and confirm password do not match',
      }, */
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
  },
  google: {
    id: {
      type: String
    },
    name: {
      type: String
    },
    photo: String,
    email: {
      type: String,
      lowercase: true,
    }
  }

});

userSchema.pre('save', async function (next) {
  try {
    if (this.method !== "local") {
      next()
    }
    if (!this.isModified('local.password') || this.isNew) return next();
    this.local.passwordChangedAt = Date.now() - 1000;
    next();
  } catch (error) {
    next(error)
  }
});

userSchema.pre('save', async function (next) {
  try {
    if (this.method !== "local") {
      next()
    }
    // only runs if password was modified
    if (!this.isModified('local.password')) return next();

    this.local.password = await bcrypt.hash(this.local.password, 12);
    this.local.passwordConfirm = undefined; // We don't want to persist the confirm pass to DB - only used for validation

    next();
  }
  catch (error) {
    next(error)
  }
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  try {
    return bcrypt.compare(candidatePassword, userPassword);
  }
  catch(err) {
    next(err);
  }
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  try {
    if (this.method !== "local") {
      next()
    }
    if (this.local.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.local.passwordChangedAt.getTime() / 1000,
        10
      );
      return JWTTimestamp < changedTimestamp;
    }
    // Not changed
    return false;
  }
  catch (error) {
    next(error)
  }
};

userSchema.methods.createPasswordResettoken = function () {
  try {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.local.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.local.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
  }
  catch(err) {
    next(err);
  }
};

// Model names always start with capital letter
const User = mongoose.model('User', userSchema);

module.exports = User;
