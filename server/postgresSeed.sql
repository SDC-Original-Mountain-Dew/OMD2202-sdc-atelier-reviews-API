\c sdc;
--\! pwd;
\copy Reviews FROM './reviews.csv' WITH (FORMAT CSV, HEADER);

\copy Photos FROM './reviews_photos.csv' WITH (FORMAT CSV, HEADER);

\copy Chars FROM './characteristics.csv' WITH (FORMAT CSV, HEADER);

\copy CharacteristicsReviews FROM './characteristic_reviews.csv' WITH (FORMAT CSV, HEADER);


INSERT INTO Characteristics (product_id, characteristic_id, name, value)
SELECT Chars.product_id, CharacteristicsReviews.characteristic_id, Chars.name, CharacteristicsReviews.value
FROM Chars INNER JOIN CharacteristicsReviews
ON Chars.id = CharacteristicsReviews.characteristic_id
ORDER BY CharacteristicsReviews.characteristic_id;

INSERT INTO reviews2 (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness, photos)
SELECT reviews.product_id, reviews.rating, reviews.date, reviews.summary, reviews.body, reviews.recommend, reviews.reported, reviews.reviewer_name,
  reviews.reviewer_email, reviews.response, reviews.helpfulness, COALESCE(photourl.photos, '[]') photos FROM reviews
LEFT JOIN (SELECT review_id, JSON_AGG(JSON_BUILD_OBJECT('url', url)) photos FROM photos GROUP BY review_id) photourl
ON photourl.review_id = reviews.id;
