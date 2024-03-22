const models = require('../models')

module.exports = {
  get: function (req, res) {
    models.reviews.getAll((err, results) => {
      if(err) {
        throw err;
        res.sendStatus(500)
      } else {
        res.send(results)
      }
    })
  }
}