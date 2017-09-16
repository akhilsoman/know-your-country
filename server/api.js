// api logic
const requesthttp = require('request');
const config = require('./config');
const _ = require('lodash');
const options = {
  'Content-Type': 'application/json',
  'method': 'GET'
};
const getAllCountries = function(request, response) {
  let option = _.merge(options,{uri : config["api-url"]+"/all"});
  let req = requesthttp(options, function(err, res, body) {
    if(res.statusCode !== 200) {
      errorHandler(res,response);
    }else{
      body = JSON.parse(body)
      .map(function(item){
        return {'country' : item.name , 'alpha2Code' : item.alpha2Code};
      })
      response.json(body)
    }
  });
};

const getCountryInformation = function(request, response) {
  let option = _.merge(options,{uri : config["api-url"]+"/alpha/"+request.params.alpha})
  let req = requesthttp(option, function(err, res, body) {
    if(res.statusCode !== 200) {
      errorHandler(res,response);
    }else{
      body = JSON.parse(body);
      response.json(body)
    }
  });
};

const errorHandler = function(res,response){
    response.status(res.statusCode);
    response.json(res.statusMessage || 'Something went wrong, Please try again after some time');
}

module.exports = {
  getAllCountries : getAllCountries,
  getCountryInformation : getCountryInformation
}
