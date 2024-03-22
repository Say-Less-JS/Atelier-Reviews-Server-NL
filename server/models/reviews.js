const db = require('../../database/index.js')


module.exports = {
  getAll: function(callback) {
    const query = 'SELECT * FROM reviews INNER JOIN reviewsphotos on reviews.id = reviewsphotos.review_id WHERE product_id = 1'
    db.query(query, (err, results) => {
      if(err) {
        callback(err, null)
      } else {
        callback(null, results)
      }
    })
  },
}

