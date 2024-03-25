const models = require('../models')

module.exports = {
  getReviews: function (req, res) {
    const parameters = req.params
    const queries = req.query
    models.reviews.getAllReviews(parameters, queries,(err, results) => {
      if(err) {
        throw err;
        res.sendStatus(500)
      } else {
        res.send(results.rows)
        console.log(req)
      }
    })
  },
  addReview: function (req, res) {
    let body =[req.body.product_id, req.body.rating, req.body.summary, req.body.body, req.body.recommend, req.body.reviewer_name, req.body.reviewer_email]
    models.reviews.addReview(body, req.body.photos,(err, results) => {
      if(err) {
        throw err
      } else {
        res.sendStatus(200)
      }
    })
    // models.reviews.addReview([req.body.product_id, req.body.rating, req.body.summary, req.body.body, req.body.recommend, req.body.reviewer_name, req.body.reviewer_email], (err) => {
    //   if(err) {
    //     throw err;
    //     res.sendStatus(500)
    //   } else {
    //     console.log(req)
    //     res.sendStatus(200)
    //   }
    // })
  },
  getMeta: function(req, res) {
    const parameters = req.params
    models.reviews.getReviewsMeta(parameters,(err, results) => {
      if(err) {
        throw err;
        res.sendStatus(500)
      } else {
        res.send(results.rows)
      }
    })
  },
  markHelpful: function(req, res) {
    const parameters = req.params
    models.reviews.markReviewHelpful(parameters, (err, results) => {
      if(err) {
        throw err;
        res.sendStatus(500)
      } else {
        console.log('Succes update', req.params)
        res.sendStatus(200)
      }
    })
  },
  reportReview: function(req, res) {
    const parameters = req.params
    models.reviews.reportReview(parameters, (err, results) => {
      if(err) {
        throw err;
        res.sendStatus(500)
      } else {
        res.sendStatus(200)
        console.log('Review reported!')
      }
    })
  }
}