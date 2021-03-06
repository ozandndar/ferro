const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');
const { getAllCars, getSingleCar, deleteSingleImage, updateImageOrder, getCarFilters } = require('../controllers/api');

router.route('/cars')
  .get(catchAsync(getAllCars))

router.get('/cars/filters', catchAsync(getCarFilters));

router.route('/cars/:id')
  .get(catchAsync(getSingleCar))

router.route('/cars/:id/image')
  .delete(isLoggedIn, catchAsync(deleteSingleImage))
  .put(isLoggedIn, catchAsync(updateImageOrder))

module.exports = router;