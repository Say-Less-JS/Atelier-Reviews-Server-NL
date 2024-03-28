const db = require('../../database/index.js')


module.exports = {
  getAllReviews: function(params, queries, callback) {
    // Default count value is 5 if not provided, null, or undefined
    let count = 5;
    let page = 1; // Default page
    let limit = count;
    let offset = 0;

    if (queries.count !== null && queries.count !== undefined) {
      count = queries.count;
      limit = count;
    }

    if (queries.page !== null && queries.page !== undefined) {
      page = queries.page;
    }

    // Calculate the offset based on the page and limit
    offset = (page - 1) * limit;

    const query = `
    SELECT json_build_object(
      'product', CAST(product_id AS TEXT),
      'page', ${page},
      'count', ${count},
      'results', (
          SELECT json_agg(
              json_build_object(
                  'review_id', pr.review_id,
                  'rating', pr.rating,
                  'summary', pr.summary,
                  'recommend', pr.recommend,
                  'response', pr.response,
                  'body', pr.body,
                  'date', pr.date,
                  'reviewer_name', pr.reviewer_name,
                  'helpfulness', pr.helpfulness,
                  'photos', pr.photos
              )
          )
          FROM (
              SELECT *
              FROM product_reviews
              WHERE product_id = p.product_id
              ORDER BY review_id ASC
              LIMIT ${limit} OFFSET ${offset}
          ) AS pr
      )
  ) AS json_data
FROM (
  SELECT DISTINCT product_id
  FROM product_reviews
  WHERE product_id = ${params.product_id}
) AS p;
`;

    db.query(query, (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  },
  addReview: function(params, photos, callback) {
    const query = `
      INSERT INTO reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE);
    `;

    db.query(query, params, (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        // If the initial query is successful
        // Proceed with inserting photos if available
        if (photos.length !== 0) {
          // Define a function to insert photos
          const insertPhotos = (index) => {
            // Check if all photos have been inserted
            if (index < photos.length) {
              // Insert the photo at the current index
              const photo = photos[index];
              const photoQuery = `
                INSERT INTO reviewsPhotos (review_id, url)
                VALUES (currval('reviews_id_seq'), $1);
              `;
              db.query(photoQuery, [photo], (err, results) => {
                if (err) {
                  callback(err, null);
                } else {
                  // Insert the next photo recursively
                  insertPhotos(index + 1);
                }
              });
            } else {
              // All photos inserted, callback with results
              callback(null, results);
            }
          };

          // Start inserting photos from index 0
          insertPhotos(0);
        } else {
          // No photos to insert, callback with results
          callback(null, results);
        }
      }
    });
  },
  getReviewsMeta: function(params, callback) {

    const query = `SELECT * FROM meta_data WHERE product_id = ${params.product_id}`

    db.query(query, (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  },
  markReviewHelpful: function(params, callback) {
    const query = `UPDATE reviews
    SET helpfulness = helpfulness + 1
    WHERE id = ${params.review_id}
    `
    db.query(query, (err, results) => {
      if(err){
        callback(err, null)
      } else {
        callback(null, results)
      }
    })
  },
  reportReview: function(params, callback) {
    const query = `UPDATE reviews SET reported = true WHERE id = ${params.review_id}`

    db.query(query, (err, results) => {
      if(err){
        callback(err, null)
      } else {
        callback(null, results)
      }
    })
  }, updateMetaData: function(callback) {
    const query = ``
  }
}

// SELECT id, name FROM characteristics WHERE product_id = 1

// SELECT json_build_object('product_id', ${Number(params.product_id)},
//       'ratings', json_build_object(
//         2::int, 1,
//         3::int, 1
//       ),
//       'recommended', json_build_object(
//         0::int, 5
//       ),
//       'characteristics', json_build_object(
//         'Size', json_build_object(
//           'id', 14,
//           'value', '3.5'
//         ),
//         'Comfort', json_build_object(
//           'id', 14,
//           'value', '4.00'
//         )
//       )
//     )




// SELECT reviews.id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness, (array_agg(reviewsphotos.url)) FROM reviews FULL JOIN reviewsphotos ON reviews.id = reviewsphotos.review_id WHERE product_id = ${Number(params.product_id)} AND reported = false GROUP BY reviews.id

// SELECT
//     json_build_object(
//       'product', ${params.product_id},
//       'results', (SELECT json_agg(json_build_object(
//         'review_id', reviews.id,
//         'rating', rating,
//         'summary', summary,
//         'recommend', recommend,
//         'response', response,
//         'body', body,
//         'date', date,
//         'reviewer_name', reviewer_name,
//         'helpfulness', helpfulness,
//         'photos', (SELECT COALESCE (json_agg(json_build_object('id', reviewsphotos.id,
//         'url', reviewsphotos.url
//         )),'[]') FROM reviewsphotos WHERE reviewsphotos.review_id = reviews.id)
//       )))
//     )
//     FROM reviews
//     WHERE product_id = ${Number(params.product_id)} AND reported = false