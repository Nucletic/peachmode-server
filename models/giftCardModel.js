const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const giftCardSchema = new Schema({
  GiftCard: {
    type: [Object],
    required: true
  }
})

module.exports = mongoose.model('giftcards', giftCardSchema);
