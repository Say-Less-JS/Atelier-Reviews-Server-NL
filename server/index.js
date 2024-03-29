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

app.use(morgan('dev'));
app.listen(process.env.PORT, ()=>{
  console.log(`Listening at localhost port ${process.env.PORT}`);
});