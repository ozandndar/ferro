const Make = require('../models/make');
const cloudinary = require('cloudinary').v2;

const renderAllMakes = async (req, res, next) => {
    const makes = await Make.find();
    res.render('make/index', { makes });
}

const createMake = async (req, res) => {
    const { name } = req.body;
    const logo = {
        url: req.file.path,
        name: req.file.originalname
    }

    const newMake = await new Make({
        name,
        logo
    });
    await newMake.save();

    return res.redirect('/make');
}

const updateMake = async (req, res) => {
    const makeObj = {};
    const { name } = req.body;

    if(req.file && req.file.path) {
        makeObj.logo = {
            url: req.file.path,
            name: req.file.originalname
        }
    }
    makeObj.name = name;
    
    const updatedMake = await Make.findByIdAndUpdate(req.params.id, makeObj);
    return res.status(200).json(updatedMake);
}

const deleteMake = async (req, res) => {
    const { id } = req.params;

    const make = await Make.findById(id);
    cloudinary.uploader.destroy(make.logo.filename);

    await Make.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Make deleted successfully' });
}

module.exports = {
    renderAllMakes,
    createMake,
    updateMake,
    deleteMake
}