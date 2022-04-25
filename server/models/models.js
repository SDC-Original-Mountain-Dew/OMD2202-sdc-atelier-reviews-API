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

function getReviews(id, page, count, sort) {
  return new Promise((resolve, reject) => {
    pool.query(`
    SELECT id AS review_id, rating, summary, recommend, response, body, date, reviewer_name, photos
    FROM reviews2
    WHERE product_id = ${id} AND reported = false
    ORDER BY ${sort} DESC
    LIMIT ${count};`
    , (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  });
}
function getMeta(id) {
  return new Promise((resolve, reject) => {
    pool.query(`
    WITH reviews AS
      (SELECT recommend, rating FROM reviews2 WHERE product_id = ${id})
    SELECT JSON_BUILD_OBJECT('ratings', meta.ratings, 'recommended', meta.recommend, 'characteristics', meta.agg_chars) FROM
      (
      SELECT * FROM
        (SELECT JSON_OBJECT_AGG(recommend_count.recommend, recommend_count.count) recommend, row_number() OVER() FROM
          (SELECT recommend, COUNT(*) FROM reviews GROUP BY recommend) recommend_count
        ) recommend_obj
      INNER JOIN
        (SELECT JSON_OBJECT_AGG(rating_counts.rating, rating_counts.count) ratings, row_number() OVER() FROM
          (SELECT rating, COUNT(*) FROM reviews GROUP BY rating) rating_counts
        ) rating_obj
      ON recommend_obj.row_number = rating_obj.row_number
      INNER JOIN
        (
        SELECT JSON_OBJECT_AGG(chars.name, chars.average) AS agg_chars, row_number() OVER() FROM
          (SELECT averages.name, JSON_BUILD_OBJECT('id', averages.characteristic_id, 'value', averages.value) average FROM
            (SELECT characteristic_id, name, AVG(value) AS value FROM characteristics WHERE product_id=${id} GROUP BY characteristic_id, name) averages
          ) chars
        ) char_obj
      ON recommend_obj.row_number = char_obj.row_number
    ) meta;`
    , (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
  })
}
function postReview(reqBody) {
  let { product_id, rating, summary, body, recommend, name, email, photos = [], characteristics} = reqBody;
  let noChar = {id: null, value: null};
  let { Length = noChar, Comfort = nunoCharll, Quality = noChar, Fit = noChar, Size = noChar, Width = noChar} = characteristics;
  let date = new Date();
  return new Promise((resolve, reject) => {
    pool.query(`
    WITH temp AS (
      INSERT INTO characteristics (product_id, characteristic_id, name, value)
      SELECT * FROM (
        VALUES
        ($1::integer, $2::integer, 'Length', $3::integer),
        ($1::integer, $4::integer, 'Comfort', $5::integer),
        ($1::integer, $6::integer, 'Quality', $7::integer),
        ($1::integer, $8::integer, 'Fit', $9::integer),
        ($1::integer, $10::integer, 'Size', $11::integer),
        ($1::integer, $12::integer, 'Width', $13::integer)
      ) as vals
      WHERE column2 IS NOT NULL
    )
    INSERT INTO reviews2
    (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness, photos)
    VALUES($1, $14, $15, $16, $17, $18, $19, $${id}, $21, $22, $23, $24)
    `
    , [product_id, Length.id, Length.value,
      Comfort.id, Comfort.value,
      Quality.id, Quality.value,
      Fit.id, Fit.value,
      Size.id, Size.value,
      Width.id, Width.value, rating, date.toISOString(),
      summary, body, recommend,
      false, name, email, '', 0, JSON.stringify(photos)]
    , (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}
function putHelpful(id) {
  return new Promise((resolve, reject) => {
    pool.query(`UPDATE reviews2 SET helpfulness = helpfulness + 1 WHERE id = ${id}`
    , (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}
function putReport(id) {
  return new Promise((resolve, reject) => {
    pool.query(`UPDATE reviews2 SET reported = true WHERE id = ${id}`
    , (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}

module.exports = {
  getReviews,
  getMeta,
  postReview,
  putHelpful,
  putReport
}
