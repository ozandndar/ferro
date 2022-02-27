const Make = require('../models/make');
const Model = require('../models/model');

const renderAllModels = async (req, res, next) => {
    const models = await Model.find().populate('make').lean();
    const makes = await Make.find();
    res.render('model/index', { models, makes });
}

const createModel = async (req, res) => {
    const { name, makeId } = req.body;
    const make = await Make.findById(makeId);

    const model = new Model({ name, make });
    await model.save();
    
    make.models.push(model);
    await make.save();

    console.log(model)
    console.log(make)

    return res.redirect('/model');
}

const updateModel = async (req, res) => {
    const modelObj = {};
    const { name, makeId } = req.body;

    const make = await Make.findById(makeId);

    modelObj.name = name;
    modelObj.make = make;

    const updatedModel = await Model.findByIdAndUpdate(req.params.id, modelObj);
    return res.status(200).json(updatedModel);
}

const deleteModel = async (req, res) => {
    const { id } = req.params;

    await Model.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Model deleted successfully' });
}

module.exports = {
    renderAllModels,
    createModel,
    updateModel,
    deleteModel
}