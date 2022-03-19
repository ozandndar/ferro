const Car = require('../models/car');
const Make = require('../models/make');
const Model = require('../models/model');
const Serie = require('../models/serie');
const cloudinary = require('cloudinary').v2;

const getAllCars = async (req, res, next) => {
  // filters: priceMin, priceMax, yearMin, yearMax, kmMin, kmMax, fuelType, vehicleType, makeId, modelId, seriId, page, limit
  const {
    priceMin,
    priceMax,
    yearMin,
    yearMax,
    kmMin,
    kmMax,
    fuelType,
    vehicleType,
    makeId,
    modelId,
    serieId,
  } = req.query;

  let { page, limit } = req.query;

  const filters = {};

  // filter if price min has value or price max has value or both
  if (priceMin || priceMax) {
    filters.price = {};
    if (priceMin) {
      filters.price.$gte = priceMin;
    }
    if (priceMax) {
      filters.price.$lte = priceMax;
    }
  }

  // filter if year min has value or year max has value or both
  if (yearMin || yearMax) {
    filters.year = {};
    if (yearMin) {
      filters.year.$gte = yearMin;
    }
    if (yearMax) {
      filters.year.$lte = yearMax;
    }
  }

  // filter if km min has value or km max has value or both
  if (kmMin || kmMax) {
    filters.km = {};
    if (kmMin) {
      filters.km.$gte = kmMin;
    }
    if (kmMax) {
      filters.km.$lte = kmMax;
    }
  }

  // filter if fuelType has value
  if (fuelType) {
    filters.fuelType = fuelType;
  }

  // filter if vehicleType has value
  if (vehicleType) {
    filters.vehicleType = vehicleType;
  }

  // filter if make has value
  if (makeId) {
    filters.make = makeId;
  }

  // filter if model has value
  if (modelId) {
    filters.model = modelId;
  }

  // filter if seri has value
  if (serieId) {
    filters.serie = serieId;
  }

  if (!page) {
    page = 1;
  }

  if (!limit) {
    limit = 99999;
  }

  const cars = await Car.find(filters)
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
    .sort({ "order": 1})
    .lean();

  const totalData = cars.length;
  const totalPages = Math.ceil(totalData / limit);

  const paginatedCars = cars.slice((page - 1) * limit, page * limit);

  return res.json({
    data: paginatedCars,
    totalData,
    totalPages,
    currentPage: page,
    limit
  });
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
  return res.json(car);
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

const updateImageOrder = async (req, res, next) => {
  const car = await Car.findById(req.params.id);
  const { carImages } = req.body;
  car.carImages = carImages;
  car.save();
  return res.json({ message: 'Image order updated successfully' });
}

const getCarFilters = async (req, res, next) => {
  const fuelTypes = await Car.distinct('fuelType');
  const vehicleTypes = await Car.distinct('vehicleType');
  const makes = await Make.find().select('name logo.url').lean();
  const models = await Model.find().select('name').lean();
  const series = await Serie.find().select('name').lean();

  return res.json({
    fuelTypes,
    vehicleTypes,
    makes,
    models,
    series,
  });
}

module.exports = {
  getAllCars,
  getSingleCar,
  deleteSingleImage,
  updateImageOrder,
  getCarFilters,
}