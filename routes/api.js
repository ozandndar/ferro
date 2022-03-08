const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');

const { getAllCars, getSingleCar } = require('../controllers/api');


router.route('/cars')
  .get(catchAsync(getAllCars))

router.route('/cars/:id')
  .get(catchAsync(getSingleCar))

module.exports = router;