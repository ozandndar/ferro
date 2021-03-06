const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({
  storage,
  limits: { fileSize: 1548576 }
});

const { renderAllCars, createCar, deleteCar, updateCar, updateCarOrder } = require('../controllers/car');
const { isLoggedIn } = require('../middleware');


// TODO(Ozan): Add validation for these routes
router.put('/update-order', isLoggedIn, catchAsync(updateCarOrder));

router.route('/')
  .get(isLoggedIn, catchAsync(renderAllCars))
  .post(isLoggedIn, upload.fields([
    { name: 'carImages', maxCount: 30 },
    { name: 'expertiseReportImage', maxCount: 1 }]), catchAsync(createCar));


router.route('/:id')
  .put(isLoggedIn, upload.fields([
    { name: 'carImages', maxCount: 30 },
    { name: 'expertiseReportImage', maxCount: 1 }]), catchAsync(updateCar))
  .delete(isLoggedIn, catchAsync(deleteCar));

module.exports = router;