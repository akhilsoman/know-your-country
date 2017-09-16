process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const express = require('express');
const path    = require('path');
const compression = require('compression')
const api    = require('./api');
const bodyParser = require('body-parser');


const port = (process.argv.slice(2).length > 0) ? parseInt(process.argv.slice(2)) : 5000 ;
// setting up express server

const app = express();

//enabling compression
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// static file server
app.use('/',express.static(path.join(__dirname,'../src')));

//Api routing
app.get('/api/getAllCountries', api.getAllCountries);
app.get('/api/getCountryInformation/:alpha', api.getCountryInformation);

//starting server
const server = app.listen(port, function () {
  console.log ('Server started on port: ' + server.address().port);
});//server start up
