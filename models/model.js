const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema({
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
    series: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Serie'
        }
    ]
});

module.exports = mongoose.model('Model', modelSchema);