const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');

let reviewsSchema = mongoose.Schema({
  product_id: { type: String, required: true },
  review_id: { type: Number, required: true },
  rating: { type: Number, required: true },
  summary: String,
  recommend: { type: Boolean, required: true },
  reported: { type: Boolean, required: true },
  response: { type: String, required: true },
  body: { type: String, required: true },
  reviewer_name: { type: String, required: true },
  helpfulness: { type: Number, required: true }
});

let Reviews = mongoose.model('Reviews', reviewsSchema);

let photosSchema = mongoose.Schema({
  review_id: { type: Number, required: true },
  url: { type: String, required: true },
});

let Photos = mongoose.model('Photos', photosSchema);

let characteristicsSchema = mongoose.Schema({
  product_id: { type: Number, required: true },
  name: { type: String, required: true },
  value: { type: Number, required: true },
});

let Characteristics = mongoose.model('Characteristics', characteristicsSchema);

module.exports.save = save;