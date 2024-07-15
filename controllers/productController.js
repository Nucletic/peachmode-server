const Product = require('../models/ProductModel');
const multer = require('multer');
const upload = multer().array('images');


exports.getNextProductId = async () => {
  try {
    const latestProduct = await Product.findOne().sort({ productId: -1 });
    const productId = latestProduct ? latestProduct.productId + 1 : 1;
    return productId;
  } catch (error) {
    throw new Error("Could not generate the next product ID");
  }
}

exports.fetchProduct = async (req, res, next) => {
  try {
    const allProducts = await Product.find({});
    res.json({
      allProducts
    })
  } catch (error) {
    next(error);
  }
}

exports.deleteProduct = async (req, res, next) => {
  try {
    const { selectedProducts } = req.body;
    const result = await Product.deleteMany({ productId: { $in: selectedProducts } });
    res.json({
      data: true
    })
  } catch (error) {
    next(error);
  }
}

exports.addProduct = async (req, res, next) => {
  try {
    const { productId, name, category, price, OriginalPrice, Images, description, Mesurements, Material,
      Color, ColorVariant, ColorVariantImages, Size, Work, StitchType, Occasion, printPattern, SupplierSKU, supplier, CountryOfOrigin,
      CareGuide, SoldOut } = req.body;

    Images.forEach((base64Image) => {
      const imageBuffer = Buffer.from(base64Image.split(',')[1], 'base64');
    })

    const newProd = new Product({
      name: name,
      category: category,
      price: price,
      OriginalPrice: OriginalPrice,
      images: Images,
      description: description,
      specifications: {
        Mesurement: Mesurements,
        Material: Material,
        Color: Color,
        ColorVariant: ColorVariant,
        ColorVariantImages: ColorVariantImages,
        Size: Size,
        Work: Work,
        StitchType: StitchType,
        Occasion: Occasion,
        PrintPattern: printPattern,
        SupplierSKU: SupplierSKU,
        Supplier: supplier,
        CountryOfOrigin: CountryOfOrigin,
        CareGuide: CareGuide,
      },
      SoldOut: SoldOut
    });
    await newProd.save();
    res.json({
      data: true
    })
  } catch (error) {
    next(error);
  }
}

exports.editProduct = async (req, res, next) => {
  try {
    const { productId, name, category, price, OriginalPrice, Images, description, Mesurements, Material,
      Color, ColorVariant, ColorVariantImages, Size, Work, StitchType, Occasion, printPattern, SupplierSKU, supplier, CountryOfOrigin,
      CareGuide, SoldOut } = req.body;
    const newProduct = await Product.findOneAndUpdate({ productId }, {
      productId: productId,
      name: name,
      category: category,
      price: price,
      OriginalPrice: OriginalPrice,
      images: Images,
      description: description,
      specifications: {
        Mesurement: Mesurements,
        Material: Material,
        Color: Color,
        ColorVariant: ColorVariant,
        ColorVariantImages: ColorVariantImages,
        Size: Size,
        Work: Work,
        StitchType: StitchType,
        Occasion: Occasion,
        PrintPattern: printPattern,
        SupplierSKU: SupplierSKU,
        Supplier: supplier,
        CountryOfOrigin: CountryOfOrigin,
        CareGuide: CareGuide,
      },
      SoldOut: SoldOut
    }, { new: true });

    await newProduct.save();
    res.json({
      data: true
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



exports.setSoldOut = async (req, res, next) => {
  try {
    const { selectedProducts } = req.body;
    console.log(selectedProducts)
    if (!Array.isArray(selectedProducts) || selectedProducts.length === 0) {
      throw new Error('Invalid selectedProducts array');
    }

    const setdeli = await Product.updateMany({ productId: { $in: selectedProducts } }, {
      $set: { SoldOut: false }
    }, { new: true });

    if (!setdeli || setdeli.nModified === 0) {
      throw new Error('No orders were updated');
    }

    res.json({
      data: setdeli
    });
  } catch (error) {
    res.json({
      error: error.message
    });
    next(error);
  }
}