const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});


const opts = { toJSON: { virtuals: true } };

const makeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    logo: ImageSchema,
    models: [{
        type: Schema.Types.ObjectId,
        ref: 'Model'
    }]
}, opts);

module.exports = mongoose.model('Make', makeSchema, 'makes');