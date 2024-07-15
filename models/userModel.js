const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    requried: true
  },
  cart: [{
    MainProduct: {
      type: Object,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  role: {
    type: String,
    default: 'basic',
    enum: ["basic", "supervisor", "admin"]
  },
  userOTP: {
    type: String
  },
  accesstoken: {
    type: String
  },
  address: [
    {
      addressId: {
        type: Number,
        required: true,
      },
      firstname: {
        type: String,
        required: true
      },
      lastname: {
        type: String,
        required: true
      },
      company: {
        type: String,
      },
      phone: {
        type: Number,
        required: true
      },
      address1: {
        type: String,
        required: true
      },
      address2: {
        type: String
      },
      city: {
        type: String,
        required: true
      },
      zipcode: {
        type: Number,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      defaultAdd: {
        type: String
      }
    }
  ]
});

module.exports = mongoose.model('users', UserSchema);