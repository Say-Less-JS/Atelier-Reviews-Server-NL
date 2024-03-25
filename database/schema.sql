DROP DATABASE IF EXISTS reviews;

CREATE DATABASE reviews;

\c reviews;

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  rating SMALLINT NOT NULL,
  date BIGINT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  recommend BOOLEAN,
  reported BOOLEAN DEFAULT false,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  response TEXT DEFAULT '',
  helpfulness INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS characteristics (
  id SERIAL PRIMARY KEY NOT NULL,
  product_id INT NOT NULL,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS characteristicsReviews (
  id SERIAL PRIMARY KEY NOT NULL,
  characteristics_id INT NOT NULL REFERENCES characteristics(id),
  review_id INT NOT NULL REFERENCES reviews(id),
  value SMALLINT NOT NULL
);


CREATE TABLE IF NOT EXISTS reviewsPhotos (
  id SERIAL PRIMARY KEY NOT NULL,
  review_id INT NOT NULL REFERENCES reviews(id),
  url TEXT NOT NULL
);

COPY reviews
FROM '/Users/nhule/HRProjects/SDC/Atelier-Reviews-Server-NL/database/data/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics
FROM '/Users/nhule/HRProjects/SDC/Atelier-Reviews-Server-NL/database/data/characteristics.csv'
DELIMITER ','
CSV HEADER;

COPY characteristicsReviews
FROM '/Users/nhule/HRProjects/SDC/Atelier-Reviews-Server-NL/database/data/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;

COPY reviewsPhotos
FROM '/Users/nhule/HRProjects/SDC/Atelier-Reviews-Server-NL/database/data/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

ALTER TABLE reviews ALTER COLUMN date TYPE TIMESTAMP USING to_timestamp(date/1000);