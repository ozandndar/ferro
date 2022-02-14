const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
    vehicleNo: {
        type: Number,
        required: [true, 'Lutfen arac no giriniz'],
        unique: true,
        min: 10000,
        max: 99999
    },
    price: {
        type: Number,
        required: [true, 'Lutfen fiyat giriniz'],
    },
    year: {
        type: Number,
        required: true
    },
    km: {
        type: Number,
    },
    status: {
        type: String,
    },
    fuelType: {
        type: String,
    },
    vehicleType: {
        type: String,
    },
    horsePower: {
        type: Number,
    },
    driveTrain: {
        type: String,
    },
    color: {
        type: String,
    },
    description: {
        type: String,
    },
    baseModel: {
        type: String
    },
    optionalSelection: {
        type: String
    },
    expertiseReportImage: {
        type: String
    },
    tramerRecord: {
        type: String
    },
    carImages: [
        {
            type: String
        }
    ],
    technicalDetails: {
        type: String
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
    Serie: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Serie'
        }
    },
    language: {
        type: String,
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('Car', carSchema);