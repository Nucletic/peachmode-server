const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const contentSchema = new Schema({
  BarText: {
    type: [String],
    required: true
  },
  SliderImages: {
    type: [String],
    required: true
  },
  MobileSliderImages: {
    type: [String],
    required: true
  }
}, { collection: 'Editable' });


module.exports = mongoose.model('Editable', contentSchema);