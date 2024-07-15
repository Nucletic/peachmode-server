const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  companyAddress: {
    type: String,
  },
  address: [
    {
      type: String,
      required: true
    }
  ],
  email: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
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
  wantEmailAndUpdates: {
    type: Boolean,
  },
  paymentMethod: {
    type: String,
    required: true
  },
  products: [{
    type: Object,
    required: true
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  delivered: {
    type: Boolean,
    default: false
  },
  orderPlaced: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = mongoose.model('orders', orderSchema);