\c sdc;
--\! pwd;
\copy Reviews FROM './reviews.csv' WITH (FORMAT CSV, HEADER);

\copy Photos FROM './reviews_photos.csv' WITH (FORMAT CSV, HEADER);

\copy Chars FROM './characteristics.csv' WITH (FORMAT CSV, HEADER);

\copy CharacteristicsReviews FROM './characteristic_reviews.csv' WITH (FORMAT CSV, HEADER);

INSERT INTO Characteristics (product_id, characteristic_id, name, value)
SELECT Chars.product_id, filled_chars.characteristic_id, Chars.name, filled_chars.value
FROM Chars INNER JOIN
( SELECT * FROM CharacteristicsReviews
  RIGHT JOIN (SELECT * FROM generate_series(1,3347679) characteristic_id) series
  USING (characteristic_id)
  ORDER BY characteristic_id ASC
) filled_chars
ON Chars.id = filled_chars.characteristic_id
ORDER BY filled_chars.characteristic_id;

INSERT INTO reviews2 (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness, photos)
SELECT reviews.product_id, reviews.rating, reviews.date, reviews.summary, reviews.body, reviews.recommend, reviews.reported, reviews.reviewer_name,
  reviews.reviewer_email, reviews.response, reviews.helpfulness, COALESCE(photourl.photos, '[]') photos FROM reviews
LEFT JOIN (SELECT review_id, JSON_AGG(JSON_BUILD_OBJECT('url', url)) photos FROM photos GROUP BY review_id) photourl
ON photourl.review_id = reviews.id;

UPDATE reviews2 SET date=date/1000;
ALTER TABLE reviews2 ALTER date TYPE TIMESTAMP WITHOUT TIME ZONE USING to_timestamp(date) AT TIME ZONE 'UTC';

CREATE INDEX char_char_idx ON characteristics(characteristic_id);
CREATE INDEX char_prod_idx ON characteristics(product_id);
CREATE INDEX reviews2_prod_idx ON reviews2(product_id);
DROP TABLE CharacteristicsReviews;
DROP TABLE Photos;
DROP TABLE Chars;
DROP TABLE reviews;
