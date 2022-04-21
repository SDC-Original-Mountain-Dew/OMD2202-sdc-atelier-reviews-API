require('dotenv').config();
const { Pool } = require('pg');
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sdc',
  password: 'hello12#',
  port: '5432'
});

function getReviews() {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT reviews.*, COALESCE(photourl.photos, '[]') photos FROM (SELECT * FROM reviews WHERE product_id = 4) reviews
    LEFT JOIN (SELECT review_id, JSON_AGG(JSON_BUILD_OBJECT('url', url, 'id', id)) photos FROM photos GROUP BY review_id) photourl
    ON reviews.id = photourl.review_id LIMIT 5;`, (error, data) => {
      if (error) {
        return reject(error)
      } else {
        resolve(data)
      }
    })
  });
}
function getMeta() {
}
function postReview() {
}
function putHelpful() {
}
function putReport() {
}

module.exports = {
  getReviews,
  getMeta,
  postReview,
  putHelpful,
  putReport
}
