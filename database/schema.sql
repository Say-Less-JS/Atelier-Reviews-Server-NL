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

CREATE TABLE IF NOT EXISTS product_reviews (
    review_id INTEGER PRIMARY KEY,
    product_id INTEGER,
    rating INTEGER,
    summary TEXT,
    recommend BOOLEAN,
    response TEXT,
    body TEXT,
    date DATE,
    reviewer_name TEXT,
    helpfulness INTEGER,
    photos JSONB[]
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

SELECT setval('"reviews_id_seq"', (SELECT MAX(id) FROM reviews)+1);

SELECT setval('"reviewsphotos_id_seq"', (SELECT MAX(id) FROM reviewsphotos)+1);

SELECT setval('"characteristicsreviews_id_seq"', (SELECT MAX(id) FROM characteristicsreviews)+1);

SELECT setval('"characteristics_id_seq"', (SELECT MAX(id) FROM characteristics)+1);


CREATE TABLE IF NOT EXISTS meta_data (
    product_id INT PRIMARY KEY,
    ratings JSONB,
    recommended JSONB,
    characteristics JSONB
);

INSERT INTO meta_data (product_id, ratings, recommended, characteristics)
SELECT
    c.product_id,
    (
        SELECT json_object_agg(entry, count)
        FROM (
            SELECT rating AS entry, COUNT(*) AS count
            FROM reviews
            WHERE product_id = c.product_id AND reported = false
            GROUP BY rating
        ) AS counts
    ) AS ratings,
    (
        SELECT json_build_object(
            '0', SUM(CASE WHEN recommend = true THEN 1 ELSE 0 END),
            '1', SUM(CASE WHEN recommend = false THEN 1 ELSE 0 END)
        )
        FROM reviews
        WHERE product_id = c.product_id AND reported = false
    ) AS recommended,
    (
        SELECT json_object_agg(char.name, json_build_object(
            'id', char.id,
            'value', AVG_value
        ))
        FROM (
            SELECT
                char.id,
                char.name,
                ROUND(AVG(cr.value), 4)::numeric AS AVG_value
            FROM
                characteristics char
                LEFT JOIN characteristicsReviews cr ON char.id = cr.characteristics_id
            WHERE
                char.product_id = c.product_id
            GROUP BY
                char.id, char.name
        ) AS char
    ) AS characteristics
FROM
    (SELECT DISTINCT product_id FROM characteristics) AS c;



INSERT INTO product_reviews (review_id, product_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness, photos)
SELECT
    r.id AS review_id,
    r.product_id,
    r.rating,
    r.summary,
    r.recommend,
    r.response,
    r.body,
    r.date,
    r.reviewer_name,
    r.helpfulness,
    COALESCE(array_agg(jsonb_build_object('id', rp.id, 'url', rp.url)), '{}'::jsonb[])
FROM reviews r
LEFT JOIN reviewsphotos rp ON rp.review_id = r.id
WHERE r.reported = false
GROUP BY r.id
ORDER BY r.helpfulness DESC;



CREATE INDEX index_reviews_product_id ON reviews(product_id);
CREATE INDEX index_reviews_reported ON reviews(reported);
CREATE INDEX index_characteristics_product_id ON characteristics(product_id);
CREATE INDEX index_characteristics_reviews_characteristics_id ON characteristicsReviews (characteristics_id);
CREATE INDEX index_meta_data_product_id ON meta_data(product_id);
CREATE INDEX index_product_reviews_product_id ON product_reviews(product_id);



ALTER TABLE reviews ALTER COLUMN date TYPE TIMESTAMP USING to_timestamp(date/1000);


CREATE OR REPLACE FUNCTION update_meta_data()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE meta_data
    SET ratings = (
        SELECT COALESCE(json_object_agg(entry, count), '[]')
        FROM (
            SELECT rating AS entry, COUNT(*) AS count
            FROM reviews
            WHERE product_id = NEW.product_id AND reported = false
            GROUP BY rating
        ) AS counts
    )
    WHERE product_id = NEW.product_id;

    UPDATE meta_data
    SET recommended = (
        SELECT json_build_object(
            '0', SUM(CASE WHEN recommend = true THEN 1 ELSE 0 END),
            '1', SUM(CASE WHEN recommend = false THEN 1 ELSE 0 END)
        )
        FROM reviews
        WHERE product_id = NEW.product_id AND reported = false
    )
    WHERE product_id = NEW.product_id;

    UPDATE meta_data
    SET characteristics = (
        SELECT json_object_agg(c.name, json_build_object(
            'id', cr.characteristics_id,
            'value', cr.value
        ))
        FROM characteristics c
        LEFT JOIN characteristicsReviews cr ON c.id = cr.characteristics_id
        WHERE c.product_id = NEW.product_id
    )
    WHERE product_id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_meta_data_trigger
AFTER INSERT ON reviews
FOR EACH ROW EXECUTE FUNCTION update_meta_data();

CREATE OR REPLACE FUNCTION update_product_reviews_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Inserting into reviews
        IF TG_RELNAME = 'reviews' THEN
            INSERT INTO product_reviews (review_id, product_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness, photos)
            SELECT
                NEW.id AS review_id,
                NEW.product_id,
                NEW.rating,
                NEW.summary,
                NEW.recommend,
                NEW.response,
                NEW.body,
                NEW.date,
                NEW.reviewer_name,
                NEW.helpfulness,
                ARRAY[]::jsonb[]
            WHERE NOT EXISTS (
                SELECT 1 FROM product_reviews WHERE review_id = NEW.id
            );
        -- Inserting into reviewsPhotos
        ELSIF TG_RELNAME = 'reviewsphotos' THEN
            INSERT INTO product_reviews (review_id, photos)
            SELECT
                NEW.review_id,
                ARRAY_AGG(jsonb_build_object('id', NEW.id, 'url', NEW.url))::jsonb[]
            FROM reviews r
            WHERE r.id = NEW.review_id
            GROUP BY NEW.review_id
            ON CONFLICT (review_id) DO UPDATE SET
                photos = EXCLUDED.photos;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_product_reviews_reviews_trigger
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_reviews_trigger();


CREATE TRIGGER update_product_reviews_reviewsphotos_trigger
AFTER INSERT ON reviewsphotos
FOR EACH ROW
EXECUTE FUNCTION update_product_reviews_trigger();


