'use strict';

const express = require('express');
const app = express();

app.use(express.static('out'));

app.get('/', function (req, res) {
  res.render("/out/index.html" );
})

app.listen(8080);