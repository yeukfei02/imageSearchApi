const mongoose = require('mongoose');
const moment = require('moment');
const momenttz = require('moment-timezone');

const userTimezone = momenttz.tz.guess();
const currentDateWithTimezone = moment.tz(moment().format(), userTimezone);

const imageSearchSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  image_ID: { type: String },
  thumbnails: { type: String },
  preview: { type: String },
  title: { type: String },
  source: { type: String },
  tags: { type: [String] },
  created_by: { type: Date, default: currentDateWithTimezone },
  updated_by: { type: Date, default: currentDateWithTimezone },
});

const imageSearchModel = mongoose.model('ImageSearch', imageSearchSchema);

module.exports = imageSearchModel;
