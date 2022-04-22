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

function getReviews(id, count, page) {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM reviews2 WHERE product_id = 4;`, (error, data) => {
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
