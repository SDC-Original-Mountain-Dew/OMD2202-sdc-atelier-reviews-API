\c sdc;
--\! pwd;
--\copy Reviews FROM './reviews.csv' WITH (FORMAT CSV, HEADER);

--\copy Photos FROM './reviews_photos.csv' WITH (FORMAT CSV, HEADER);

--\copy Chars FROM './characteristics.csv' WITH (FORMAT CSV, HEADER);

\copy CharacteristicsReviews FROM './characteristic_reviews.csv' WITH (FORMAT CSV, HEADER);


INSERT INTO Characteristics (id, product_id, name, value)
SELECT CharacteristicsReviews.id, Chars.product_id, Chars.name, CharacteristicsReviews.value
FROM Chars INNER JOIN CharacteristicsReviews
ON Chars.id = CharacteristicsReviews.characteristic_id
ORDER BY CharacteristicsReviews.characteristic_id;

INSERT INTO reviews2
SELECT reviews.*, COALESCE(photourl.photos, '[]') photos FROM reviews
LEFT JOIN (SELECT review_id, JSON_AGG(JSON_BUILD_OBJECT('url', url)) photos FROM photos GROUP BY review_id) photourl
ON photourl.review_id = reviews.id;