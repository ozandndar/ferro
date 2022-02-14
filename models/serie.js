const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serieSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    make: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Make'
        }
    },
    model: {    
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Model'
        }
    },
});

module.exports = mongoose.model('Serie', serieSchema);