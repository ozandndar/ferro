const Car = require('../models/car');

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

module.exports = {
  getAllCars,
  getSingleCar
}