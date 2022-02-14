const express = require('express');
const router = express.Router({ mergeParams: true });
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const { getAllMakes, createMake, renderCreateMakePage, renderEditMakePage, deleteMake, updateMake } = require('../controllers/make');
const { isLoggedIn, validateMake } = require('../middleware');

const Make = require('../models/make');


router.route('/')
    .get(isLoggedIn, catchAsync(getAllMakes))
    .post(isLoggedIn, upload.single('image'), validateMake, catchAsync(createMake));


router.get('/new', isLoggedIn, renderCreateMakePage);

router.route('/:id')
    .get(isLoggedIn, catchAsync(getAllMakes))
    .put(isLoggedIn, upload.array('image'), validateMake, catchAsync(updateMake))
    .delete(isLoggedIn, catchAsync(deleteMake));

router.get('/:id/edit', isLoggedIn, renderEditMakePage);

module.exports = router;