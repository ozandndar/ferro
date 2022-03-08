const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});



const carSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Lutfen arac adi giriniz'],
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
  technicalDetails: {
    type: String
  },
  tramerRecord: {
    type: String
  },
  gearType: {
    type: String
  },
  expertiseReportImage: ImageSchema,
  carImages: [
    ImageSchema
  ],
  make: {
    type: Schema.Types.ObjectId,
    ref: 'Make'
  },
  model: {
    type: Schema.Types.ObjectId,
    ref: 'Model'
  },
  serie: {
    type: Schema.Types.ObjectId,
    ref: 'Serie'
  },
  language: {
    type: String,
  }
},
  {
    timestamps: true
  })

module.exports = mongoose.model('Car', carSchema);