const Make = require('../models/make');
const Model = require('../models/model');
const Serie = require('../models/serie');
const Car = require('../models/car');
const { populate } = require('../models/car');

const renderAllCars = async (req, res, next) => {
  const makes = await Make.find().populate({
    path: 'models',
    select: '-make',
    populate: {
      path: 'series',
      model: 'Serie',
      select: '-__v  -model'
    }
  }).lean();
  const series = await Serie.find().populate('model').lean();
  const cars = await Car.find().populate({
    path: 'serie',
    select: '-__v -cars',
    populate: {
      path: 'model',
      model: 'Model',
      select: '-__v -series',
      populate: {
        path: 'make',
        model: 'Make',
        select: '-__v -models'
      }
    }
  })
  .select('-__v -make -model')  
  .lean();
  res.render('car/index', { makes, series, cars });
}

const createCar = async (req, res) => {
  const { makeId, modelId, serieId } = req.body;
  const newCarObj = { ...req.body };


  if (req.files) {
    if (req.files.expertiseReportImage) {
      newCarObj.expertiseReportImage = {
        url: req.files.expertiseReportImage[0].path,
        name: req.files.expertiseReportImage[0].originalname
      }
    }
    if (req.files.carImages) {
      newCarObj.carImages = req.files.carImages.map(file => {
        return {
          url: file.path,
          name: file.originalname
        }
      })
    }
  }

  console.log("files:", req.files)
  console.log("-----")
  console.log("car", newCarObj)

  const make = await Make.findById(makeId);
  const model = await Model.findById(modelId);
  const serie = await Serie.findById(serieId);


  const car = new Car({ ...newCarObj, make, model, serie });
  await car.save();

  console.log("created car:", car)

  serie.cars.push(car);
  await serie.save();

  return res.redirect('/car');
}

const updateCar = async (req, res) => {
  const serieObj = {};
  const { name, modelId } = req.body;

  const model = await Model.findById(modelId);

  serieObj.name = name;
  serieObj.model = model;

  const updatedSerie = await Serie.findByIdAndUpdate(req.params.id, serieObj);
  return res.status(200).json(updatedSerie);
}

const deleteCar = async (req, res) => {
  const { id } = req.params;

  await Serie.findByIdAndDelete(id);
  return res.status(200).json({ message: 'Serie deleted successfully' });
}

module.exports = {
  renderAllCars,
  createCar,
  updateCar,
  deleteCar
}