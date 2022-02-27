const Make = require('../models/make');
const Model = require('../models/model');
const Serie = require('../models/serie');

const renderAllSeries = async (req, res, next) => {
    const makes = await Make.find().populate('models').lean();
    const series = await Serie.find().populate({
        path: 'model',
        populate: {
            path: 'make',
            model: 'Make'
        }
    }).lean();
    res.render('serie/index', { makes, series });
}

const createSerie = async (req, res) => {
    const { name, modelId } = req.body;
    const model = await Model.findById(modelId);

    const serie = new Serie({ name, model });
    await serie.save();

    model.series.push(model);
    await model.save();

    console.log(model)
    console.log(serie)

    return res.redirect('/serie');
}

const updateSerie = async (req, res) => {
    const serieObj = {};
    const { name, modelId } = req.body;

    const model = await Model.findById(modelId);

    serieObj.name = name;
    serieObj.model = model;

    const updatedSerie = await Serie.findByIdAndUpdate(req.params.id, serieObj);
    return res.status(200).json(updatedSerie);
}

const deleteSerie = async (req, res) => {
    const { id } = req.params;

    await Serie.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Serie deleted successfully' });
}

module.exports = {
    renderAllSeries,
    createSerie,
    updateSerie,
    deleteSerie
}