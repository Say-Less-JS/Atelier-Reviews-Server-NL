const router = require('express').Router()
const controllers = require('./controllers')

router.get('/reviews', controllers.messages.get)

module.exports = router