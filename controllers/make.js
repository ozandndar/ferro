const Make = require('../models/make');

const renderCreateMakePage = (req, res) => { 
    res.render('make/create');
}   

const getAllMakes = (req, res) => {
    Make.find()
        .then(makes => {
            res.render('make/index', { makes });
        })
        .catch(err => {
            console.log(err);
        });
}

const createMake = (req, res) => {
    const { name, year, model, description, image } = req.body;
    const newMake = new Make({
        name,
        year,
        model,
        description,
        image
    });
    newMake.save()
        .then(() => {
            res.redirect('/make');
        })
        .catch(err => {
            console.log(err);
        });
}

const updateMake = (req, res) => {
    const { name, year, model, description, image } = req.body;
    Make.findByIdAndUpdate(req.params.id, {
        name,
        year,
        model,
        description,
        image
    })
    .then(() => {
        res.redirect('/make');
    })
    .catch(err => {
        console.log(err);
    });
}

const renderEditMakePage = (req, res) => {
    Make.findById(req.params.id)
        .then(make => {
            res.render('make/edit', { make });
        })
        .catch(err => {
            console.log(err);
        });
}

const deleteMake = async (req, res) => {
    const { id } = req.params;

    const make = await Make.findById(id);
    cloudinary.uploader.destroy(make.logo.filename);

    await Make.findByIdAndDelete(id)
}

module.exports = {
    getAllMakes,
    renderCreateMakePage,
    renderEditMakePage,
    createMake,
    updateMake,
    deleteMake
}