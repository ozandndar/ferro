const Car = require('../models/car');
const cloudinary = require('cloudinary').v2;

const getAllCars = async (req, res, next) => {
  const cars = await Car.find()
    .populate({
      path: 'serie model make',
      select: '-__v -models',
    })
    .populate({
      path: 'serie model',
      select: '-__v -series -make',
    })
    .populate({
      path: 'serie',
      select: '-__v -cars -model',
    })
    .select('-__v')
    .lean();
  res.json(cars);
}

const getSingleCar = async (req, res, next) => {
  const car = await Car.findById(req.params.id)
    .populate({
      path: 'serie model make',
      select: '-__v -models',
    })
    .populate({
      path: 'serie model',
      select: '-__v -series -make',
    })
    .populate({
      path: 'serie',
      select: '-__v -cars -model',
    })
    .select('-__v')
    .lean();
  res.json(car);
}

const deleteSingleImage = async (req, res, next) => {
  const { result } = await cloudinary.uploader.destroy(req.query.filename.replace('.', '/'));

  if (result == 'ok') {
    const car = await Car.findById(req.params.id);
    console.log(car);
    car.carImages = car.carImages.filter(image => image.filename !== req.query.filename.replace('.', '/'));
    console.log(car.carImages)
    car.save();
    return res.json({ message: 'Image deleted successfully' });
  }

  return res.status(400).json({ message: 'Image not found' });
}

module.exports = {
  getAllCars,
  getSingleCar,
  deleteSingleImage
}