const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const { renderAllModels, createModel, deleteModel, updateModel } = require('../controllers/model');
const { isLoggedIn } = require('../middleware');


// TODO(Ozan): Add validation for these routes

router.route('/')
    .get(isLoggedIn, catchAsync(renderAllModels))
    .post(isLoggedIn, upload.single('image'), catchAsync(createModel));


router.route('/:id')
    .put(isLoggedIn, upload.single('image'), catchAsync(updateModel))
    .delete(isLoggedIn, catchAsync(deleteModel));


module.exports = router;