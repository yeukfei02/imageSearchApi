const mongoose = require('mongoose');
const moment = require('moment');
const momenttz = require('moment-timezone');

const userTimezone = momenttz.tz.guess();
const currentDateWithTimezone = moment.tz(moment().format(), userTimezone);

const videoSearchSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  video_id: { type: String },
  type: { type: String },
  videos: { type: mongoose.Schema.Types.Mixed },
  source: { type: String },
  tags: { type: [String] },
  views: { type: Number },
  downloads: { type: Number },
  created_by: { type: Date, default: currentDateWithTimezone },
  updated_by: { type: Date, default: currentDateWithTimezone },
});

const videoSearchModel = mongoose.model('VideoSearch', videoSearchSchema);

module.exports = videoSearchModel;
