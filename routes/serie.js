const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const { renderAllSeries, createSerie, deleteSerie, updateSerie } = require('../controllers/serie');
const { isLoggedIn } = require('../middleware');


// TODO(Ozan): Add validation for these routes

router.route('/')
    .get(isLoggedIn, catchAsync(renderAllSeries))
    .post(isLoggedIn, upload.single('image'), catchAsync(createSerie));


router.route('/:id')
    .put(isLoggedIn, upload.single('image'), catchAsync(updateSerie))
    .delete(isLoggedIn, catchAsync(deleteSerie));


module.exports = router;