const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');

const { getAllCars, getSingleCar, deleteSingleImage } = require('../controllers/api');

router.route('/cars')
  .get(catchAsync(getAllCars))

router.route('/cars/:id')
  .get(catchAsync(getSingleCar))

router.route('/cars/:id/image')
  .delete(catchAsync(deleteSingleImage))

module.exports = router;