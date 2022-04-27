require('dotenv').config();
const { Pool } = require('pg');
const format = require('pg-format');
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  user: `${process.env.DB_USER || 'postgres'}`,
  host: `${process.env.DB_HOST || '184.169.206.75'}`,
  database: `${process.env.DB_NAME || 'sdc'}`,
  password: `${process.env.DB_PASSWORD || 'hellO12#'}`,
  port: `${process.env.DB_PORT || 5432}`
});

function getReviews(id, page, count, sort) {
  const sql = format(`
  SELECT id AS review_id, rating, summary, recommend, response, body, date, reviewer_name, photos
  FROM reviews2
  WHERE product_id = %L AND reported = false
  ORDER BY %s DESC
  LIMIT %L
  OFFSET %L;`, id, sort, count, (page - 1) * count);
  return new Promise((resolve, reject) => {
    pool.query(sql, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  });
}

function getMeta(id) {
  const sql = format(`
  WITH reviews AS
    (SELECT recommend, rating FROM reviews2 WHERE product_id = %L)
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
          (SELECT characteristic_id, name, AVG(value) AS value FROM characteristics WHERE product_id=%L GROUP BY characteristic_id, name) averages
        ) chars
      ) char_obj
    ON recommend_obj.row_number = char_obj.row_number
  ) meta;`, id, id);
  return new Promise((resolve, reject) => {
    pool.query(sql, (error, data) => {
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
  const sql = format(`
  WITH temp AS (
    INSERT INTO characteristics (product_id, characteristic_id, name, value)
    SELECT * FROM (
      VALUES
      (%L::integer, %L::integer, 'Length', %L::integer),
      (%L::integer, %L::integer, 'Comfort', %L::integer),
      (%L::integer, %L::integer, 'Quality', %L::integer),
      (%L::integer, %L::integer, 'Fit', %L::integer),
      (%L::integer, %L::integer, 'Size', %L::integer),
      (%L::integer, %L::integer, 'Width', %L::integer)
    ) as vals
    WHERE column2 IS NOT NULL
  )
  INSERT INTO reviews2
  (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness, photos)
  VALUES(%L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L)`
  , product_id, Length.id, Length.value,
  product_id, Comfort.id, Comfort.value,
  product_id, Quality.id, Quality.value,
  product_id, Fit.id, Fit.value,
  product_id, Size.id, Size.value,
  product_id, Width.id, Width.value, product_id, rating, date.toISOString(),
  summary, body, recommend,
  false, name, email, '', 0, JSON.stringify(photos))
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}

function putHelpful(id) {
  const sql = format(`UPDATE reviews2 SET helpfulness = helpfulness + 1 WHERE id = %L}`, id)
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}

function putReport(id) {
  const sql = format(`UPDATE reviews2 SET reported = true WHERE id = %L}`, id)
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, data) => {
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
