const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrailSchema = new Schema({
  trail_id: {
    type: Number,
    required: true
  },
  trail_name: {
    type: String,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  distance_units: {
    type: String,
    required: true
  },
  elevation_gain: {
    type: Number,
    required: true
  },
  elevation_units: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  route_type: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    required: true
  },
  general_area: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
});
//

module.exports = Photo = mongoose.model('Photo', PhotoSchema);