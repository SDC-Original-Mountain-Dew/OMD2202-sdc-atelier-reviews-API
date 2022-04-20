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
  product_id INTEGER NOT NULL,
  review_id SERIAL UNIQUE NOT NULL,
  rating INTEGER NOT NULL,
  summary VARCHAR(60) NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  response VARCHAR(1000) NOT NULL,
  body VARCHAR(1000) NOT NULL,
  date TIMESTAMP NOT NULL,
  reviewer_name TEXT NOT NULL,
  helpfulness INTEGER NOT NULL,
  PRIMARY KEY (product_id, review_id)
);

-- ---
-- Table Characteristics
--
-- ---

DROP TABLE IF EXISTS Characteristics;

CREATE TABLE Characteristics (
  id SERIAL UNIQUE NOT NULL,
  product_id INTEGER NOT NULL,
  name TEXT NOT NULL,
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
  review_id INTEGER NOT NULL,
  id SERIAL NOT NULL,
  url TEXT NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE Characteristics ADD FOREIGN KEY (review_id) REFERENCES Reviews (review_id);
ALTER TABLE Photos ADD FOREIGN KEY (review_id) REFERENCES Reviews (review_id);

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