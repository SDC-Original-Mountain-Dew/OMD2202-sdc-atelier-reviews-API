const db = require('../models/models');


function getReviews(req, res) {
  const { product_id, page = 1, count = 5 } = req.query;
  db.getReviews(product_id, page, count)
  .then((data) => {
    let result = {
      product: product_id,
      page,
      count,
      results: data.rows
    };
    res.send(result);
  })
  .catch((error) => console.log(error));
}
function getMeta(req, res) {
  db.getMeta(req.query.product_id)
  .then((data) => {
    let result = data.rows[0].json_build_object;
    result.product_id = req.query.product_id;
    res.send(result);
  })
  .catch((error) => console.log(error));
}
function postReview(req, res) {
  db.postReview(req.body)
  .then(() => res.status(201).send())
  .catch((error) => console.log(error));

}
function putHelpful(req, res) {
  db.putHelpful(req.params.review_id)
  .then(() => res.status(204).send())
  .catch((error) => console.log(error));
}
function putReport(req, res) {
  db.putReport(req.params.review_id)
  .then(() => res.status(204).send())
  .catch((error) => console.log(error));
}

module.exports = {
  getReviews,
  getMeta,
  postReview,
  putHelpful,
  putReport
}
