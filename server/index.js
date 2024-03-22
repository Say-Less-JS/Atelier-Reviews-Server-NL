//server page
require('dotenv').config();
const morgan = require('morgan')
const axios = require('axios');
const express = require('express');
const path = require('path');
const app = express();
const csvtojson = require('csvtojson')
const dbHelper = require('../database/index.js')
const router = require('./routes.js')



app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json());


app.use('/reviews', router)

// //product
// app.get('/product:id', function (req, res) {
//   //console.log(req.params.id.slice(1));
//   axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/products/${req.params.id.slice(1)}`, token)
//     .then((response) => {
//       res.send(response.data);
//     })
//     .catch(() => {
//       res.status(401).send()
//     });
// })
// //cart
// app.get('/cart:id', function (req, res) {
//   axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/cart?session_id=${req.params.id.slice(1)}`, token)
//     .then((response) => {
//       res.send(response.data);
//     })
//     .catch(() => {
//       res.status(401).send()
//     });
// });
// //related
// app.get('/related:id', function (req, res) {
//   axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/products/${req.params.id.slice(1)}/related`, token)
//     .then((response) => {
//       res.send(response.data);
//     })
//     .catch(() => {
//       res.status(401).send()
//     });
// });
// //styles
// app.get('/styles:id', function (req, res) {
//   axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/products/${req.params.id.slice(1)}/styles`, token)
//     .then((response) => {
//       res.send(response.data);
//     })
//     .catch(() => {
//       res.status(401).send()
//     });
// });
// //meta
// app.get('/meta:id', function (req, res) {
//   axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/reviews/meta/?product_id=${req.params.id.slice(1)}`, token)
//     .then((response) => {
//       res.send(response.data);
//     })
//     .catch(() => {
//       res.status(401).send()
//     });
// });
// //reviews
// app.get('/reviews:id', function (req, res) {
//   axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/reviews/?product_id=${req.params.id.slice(1)}&count=100`, token)
//     .then((response) => {
//       res.send(response.data);
//     })
//     .catch(() => {
//       res.status(401).send()
//     });
// });
// //sort
// app.get('/reviews:id/sort:sort', function (req, res) {
//   axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/reviews?sort=${req.params.sort.slice(1)}&product_id=${req.params.id.slice(1)}&count=100`, token)
//     .then((response) => {
//       res.send(response.data);
//     })
//     .catch(() => {
//       res.status(401).send()
//     });
// });
// //helpful review
// app.put('/reviews:id/helpful', function (req, res) {
//   axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/reviews/${req.params.id.slice(1)}/helpful`, null , token)
//     .then(() => {
//       res.status(200).send()
//     })
//     .catch(() => {
//       res.status(401).send()
//     });
// });
// //reported review
// app.put('/reviews:id/report', function(req, res) {
//   axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/reviews/${req.params.id.slice(1)}/report`, null , token)
//     .then(() => {
//       res.status(200).send();
//     })
//     .catch(() => {
//       res.status(401).send();
//     })
// })
// //review post
// app.post('/reviews', function(req, res) {
//   axios.post(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/reviews`, req.body, token)
//     .then(() => {
//       res.status(201).send();
//     })
//     .catch(() => {
//       res.status(401).send();
//     })
// })
// //questions list
// app.get('/questions:id', function (req, res) {
//   axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/qa/questions/?product_id=${req.params.id.slice(1)}&count=100`, token)
//     .then((response) => {
//       res.send(response.data);
//     })
//     .catch(() => {
//       res.status(401).send()
//     });
// });
// // Questions helpful review
// app.put('/questions:id/helpful', function (req, res) {
//   axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/qa/questions/${req.params.id.slice(1)}/helpful`, null , token)
//     .then(() => {
//       res.status(200).send()
//     })
//     .catch(() => {
//       res.status(401).send()
//     });
// });
// //Add answer
// app.post('/answers:id', function(req, res) {
//   axios.post(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/qa/questions/${req.params.id.slice(1)}/answers`, req.body, token)
//     .then(() => {
//       res.status(201).send();
//     })
//     .catch(() => {
//       res.status(401).send();
//     })
// })
// //Answers List
// app.get('/answers_list:id', function (req, res) {
//   axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/qa/questions/${req.params.id.slice(1)}/answers/?count=11`, token)
//     .then((response) => {
//       res.send(response.data);
//     })
//     .catch(() => {
//       res.status(401).send()
//     });
// });
// // Answers helpful review
// app.put('/answers:id/helpful', function (req, res) {
//   axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/qa/answers/${req.params.id.slice(1)}/helpful`, null , token)
//     .then(() => {
//       res.status(200).send()
//     })
//     .catch(() => {
//       res.status(401).send()
//     });
// });
// // Answers report
// app.put('/answers:id/report', function (req, res) {
//   axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/qa/answers/${req.params.id.slice(1)}/report`, null , token)
//     .then(() => {
//       res.status(200).send()
//     })
//     .catch(() => {
//       res.status(401).send()
//     });
// });
// //Add a question
// app.post('/questions:id', function(req, res) {
//   axios.post(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/qa/questions/?product_id=${req.params.id.slice(1)}`, req.body, token)
//     .then(() => {
//       res.status(201).send();
//     })
//     .catch(() => {
//       res.status(401).send();
//     })
// })
app.listen(process.env.PORT, ()=>{
  console.log(`Listening at localhost port ${process.env.PORT}`);
});