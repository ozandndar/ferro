const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const { renderAllMakes, createMake, deleteMake, updateMake } = require('../controllers/make');
const { isLoggedIn, validateMake } = require('../middleware');


router.route('/')
    .get(isLoggedIn, catchAsync(renderAllMakes))
    .post(isLoggedIn, upload.single('image'), validateMake, catchAsync(createMake));


router.route('/:id')
    .put(isLoggedIn, upload.single('image'), validateMake, catchAsync(updateMake))
    .delete(isLoggedIn, catchAsync(deleteMake));


module.exports = router;