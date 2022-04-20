-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table Review
--
-- ---
-- DROP DATABASE IF EXISTS SDC;
-- CREATE DATABASE SDC;
\c sdc;
DROP TABLE IF EXISTS Reviews;

CREATE TABLE Reviews (
  id SERIAL UNIQUE NOT NULL,
  product_id INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  date VARCHAR(32) NOT NULL,
  summary VARCHAR(128) NULL,
  body VARCHAR(1000) NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  reviewer_name VARCHAR(255) NOT NULL,
  reviewer_email VARCHAR(255) NOT NULL,
  response VARCHAR(1000) NOT NULL,
  helpfulness INTEGER NOT NULL,
  PRIMARY KEY (product_id, id)
);

-- ---
-- Table Characteristics
--
-- ---

DROP TABLE IF EXISTS Characteristics;

CREATE TABLE Characteristics (
  id SERIAL UNIQUE NOT NULL,
  product_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  value INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table Photos
--
-- ---

DROP TABLE IF EXISTS Photos;

CREATE TABLE Photos (
  id SERIAL NOT NULL,
  review_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE CharacteristicsReviews (
  id SERIAL NOT NULL,
  characteristic_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  value INTEGER NOT NULL,
  PRIMARY KEY (id)
);





-- ---
-- Foreign Keys
-- ---

ALTER TABLE Characteristics ADD FOREIGN KEY (review_id) REFERENCES Reviews (id);
ALTER TABLE Photos ADD FOREIGN KEY (review_id) REFERENCES Reviews (id);
ALTER TABLE CharacteristicsReviews ADD FOREIGN KEY (review_id) REFERENCES Reviews (id);
ALTER TABLE CharacteristicsReviews ADD FOREIGN KEY (characteristic_id) REFERENCES Chars (id);


-- ---
-- Table Properties
-- ---

-- ALTER TABLE Review ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE Characteristics ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE Photos ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO Review (product_id,review_id,rating,summary,recommend,response,body,date,reviewer_name,helpfulness,reported) VALUES
-- (,,,,,,,,,,);
-- INSERT INTO Characteristics (id,product_id,name,value) VALUES
-- (,,,);
-- INSERT INTO Photos (review_id,id,url) VALUES
-- (,,);