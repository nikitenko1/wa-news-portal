const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
    password: {
      type: String,
      trim: true,
      require: true,
      select: false,
    },
    username: {
      type: String,
      trim: true,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: 'user',
    },
    profileImage: {
      url: {
        type: String,
        default:
          'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png',
      },
      public_id: {
        type: String,
        default: '',
      },
    },
    security: {
      otp: {
        type: String,
        default: '',
      },
      expirationTime: Date,
    },
    unreadMessage: {
      type: Boolean,
      default: false,
    },
    unreadNotification: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
