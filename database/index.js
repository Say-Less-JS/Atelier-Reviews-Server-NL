const {Pool} = require('pg')

const client = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD
})

client.connect()
.then(() => {
  console.log('Connected to PostgreSQL databases');
})
.catch((err) => {
  console.error('Error connecting to PostgreSQL database', err);
});

module.exports = client


// const mongoose = require('mongoose');

// mongoose.connect(`mongodb://localhost/reviews`)
// .then(() => {
//   console.log('Database Connected!');
// })
// .catch((err) => {
//   throw err;
// })



// let reviewsSchema = mongoose.Schema({
//   product_id: {type: Number, required: true},
//   rating: {type: Number, required: true},
//   date: {type: Date, required: true},
//   summary: {type: String, required: true},
//   body: {type: String, required: true},
//   reccomend: {type: Boolean, required: true},
//   reported: {type: Boolean, required: true},
//   reviewer_name: {type: String, required: true},
//   reviewer_email: {type: String, required: true},
//   response: {type: String},
//   helpfulness: {type: Number, required: true}
// })

// let Review = mongoose.model('Reviews', reviewsSchema)
// Review.createCollection()

// let characteristicsSchema = mongoose.Schema({
//   product_id: {type: Number, required: true},
//   name: {type: String, required: true}
// })

// let Characteristics = mongoose.model('Characteristics', characteristicsSchema)

// let characteristicsReviewsSchema = mongoose.Schema({
//   characteristic_id: {type: Number, required: true},
//   review_id: {type: Number, required: true},
//   value: {type: Number, required: true},
// })

// let CharacteristicsReviews = mongoose.model('CharacteristicsReviews', characteristicsReviewsSchema)

// let reviewsPhotos = mongoose.Schema({
//   review_id: {type: Number, required: true},
//   url: {type: String, required: true}
// })

// module.exports.Review = Review
// module.exports.Characteristics = Characteristics
// module.exports.CharacteristicsReviews = CharacteristicsReviews

module.exports = client
