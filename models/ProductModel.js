const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productController = require('../controllers/productController')

const productSchema = new Schema({
  productId: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  OriginalPrice: {
    type: Number,
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  specifications: {
    Mesurement: {
      type: String,
      required: true
    },
    Material: {
      type: String,
      required: true
    },
    Color: {
      type: String,
      required: true
    },
    ColorVariant: {
      type: [String],
    },
    ColorVariantImages: {
      type: [String],
    },
    Size: {
      type: [String],
    },
    Work: {
      type: String,
      required: true
    },
    StitchType: {
      type: String,
      required: true
    },
    Occasion: {
      type: String,
      required: true
    },
    PrintPattern: {
      type: String,
      required: true
    },
    SupplierSKU: {
      type: String,
      required: true
    },
    Supplier: {
      type: String,
      required: true
    },
    CountryOfOrigin: {
      type: String,
      required: true
    },
    CareGuide: {
      type: String,
      required: true
    }
  },
  SoldOut: {
    type: Boolean,
    required: true,
    default: false
  }
});

productSchema.pre('save', async function (next) {
  if (!this.productId) {
    this.productId = await productController.getNextProductId();
  }
  next();
});

module.exports = mongoose.model('products', productSchema);