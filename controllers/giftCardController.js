const GiftCard = require('../models/giftCardModel');

exports.addGiftCard = async (req, res, next) => {
  try {
    const { _id, giftCard } = req.body;
    const filteredArray = giftCard.filter(obj => Object.keys(obj).length > 0);

    const update = {
      GiftCard: filteredArray
    };

    await GiftCard.updateOne({ _id: _id }, update, { upsert: true });

    res.json({
      data: true
    });
  } catch (error) {
    next(error);
  }
};

exports.getGiftCards = async (req, res, next) => {
  try {
    const giftCard = await GiftCard.find({});

    res.json({
      giftCard
    })
  } catch (error) {
    next(error);
  }
}

exports.verifyGiftCards = async (req, res, next) => {
  try {
    const { giftCard } = req.body;
    const existingGiftCard = await GiftCard.findOne({ "GiftCard": { $elemMatch: { [giftCard]: { $exists: true } } } });
    if (existingGiftCard) {
      const matchingElement = existingGiftCard.GiftCard.find((element) => element[giftCard]);
      res.status(200).json({ element: matchingElement });
    } else {
      res.status(404).json({ message: 'Gift card value not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};