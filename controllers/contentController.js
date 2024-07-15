const Content = require('../models/contentModel');


exports.getContent = async (req, res, next) => {
  try {
    const allContent = await Content.find({});

    res.json({
      allContent
    })
  } catch (error) {
    next(error);
  }
}


exports.saveContent = async (req, res, next) => {
  try {
    const { _id, BarText, SliderImages, MobileSliderImages } = req.body;

    const filteredArray = SliderImages.filter((element) => element.length > 0);
    const filteredArray2 = MobileSliderImages.filter((element) => element.length > 0);
    const filteredText = BarText.filter((element) => element.length > 0);

    const processImage = async (base64Image) => {
      if (base64Image.length > 0) {
        const imageBuffer = Buffer.from(base64Image.split(',')[1], 'base64');
      }
    };

    await Promise.all(filteredArray.map(processImage));
    await Promise.all(filteredArray2.map(processImage));

    const update = {
      BarText: filteredText,
      SliderImages: filteredArray,
      MobileSliderImages: filteredArray2
    };

    const allContent = await Content.updateOne({ _id }, update);
    
    res.json({
      data: true
    });
  } catch (error) {
    next(error);
  }
};






