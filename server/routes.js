const router = require('express').Router()
const controllers = require('./controllers')

router.get('/:product_id', controllers.reviews.getReviews)
router.get('/:product_id/meta', controllers.reviews.getMeta)
router.put('/:review_id/helpful', controllers.reviews.markHelpful)
router.put('/:review_id/report', controllers.reviews.reportReview)
router.post('/:product_id', controllers.reviews.addReview)

module.exports = router