const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serieSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    model: {
        type: Schema.Types.ObjectId,
        ref: 'Model'
    },
});

module.exports = mongoose.model('Serie', serieSchema);