const db = require('../models/models');

function getReviews(req, res) {
  db.getReviews()
  .then((data) => res.send(data.rows))
  .catch((error) => console.log(error));
}
function getMeta(req, res) {
  res.send('meta');
}
function postReview(req, res) {
  res.status(201).send();
}
function putHelpful(req, res) {
  res.status(204).send();
}
function putReport(req, res) {
  res.status(204).send();
}

module.exports = {
  getReviews,
  getMeta,
  postReview,
  putHelpful,
  putReport
}
