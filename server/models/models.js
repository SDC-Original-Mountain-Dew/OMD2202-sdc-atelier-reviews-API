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
        reject(error)
      } else {
        resolve(data)
      }
    })
  });
}
function getMeta() {
  return new Promise((resolve, reject) => {
    pool.query(`
    SELECT JSON_BUILD_OBJECT('ratings', meta.ratings, 'recommended', meta.recommend, 'characteristics', meta.characteristics) FROM
    (
      SELECT * FROM
        (SELECT JSON_OBJECT_AGG(recommend_count.recommend, recommend_count.count) recommend, row_number() OVER() FROM
          (SELECT recommend, COUNT(*) FROM reviews2 where product_id=20 GROUP BY recommend) recommend_count
        ) recommend_obj
      INNER JOIN
        (SELECT JSON_OBJECT_AGG(rating_counts.rating, rating_counts.count) ratings, row_number() OVER() FROM
          (SELECT rating, COUNT(*) FROM reviews2 WHERE product_id=20 GROUP BY rating) rating_counts
        ) rating_obj
      ON recommend_obj.row_number = rating_obj.row_number
      INNER JOIN
        (
        SELECT JSON_OBJECT_AGG(chars.name, chars.average) AS characteristics, row_number() OVER() FROM
          (SELECT averages.name, JSON_BUILD_OBJECT('id', averages.characteristic_id, 'value', averages.value) average FROM
            (SELECT name, AVG(value) AS value, characteristic_id FROM characteristics WHERE product_id=20 GROUP BY characteristic_id, name) averages
          ) chars
        ) char_obj
      ON recommend_obj.row_number = char_obj.row_number
    ) meta;`, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
  })
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
