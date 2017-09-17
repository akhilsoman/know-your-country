const Countries = function(config) {
  this.$el = document.querySelector('.app-wrap');
  this.init()
};

//Init Method
Countries.prototype.init = function() {
  let self = this;
  this.showLoader('show');

  //Click event for submit button
  self.$el.querySelector('#submit').addEventListener('click', function(e) {
    e.preventDefault();
    self.getCountrySpecificInfo();
  });

  this.getCountriesInfo(apiEndpoints.getAllCountries).then(function(response) {
    let list = self.$el.querySelector('#countries');
    response.forEach(function(item) {
      list.innerHTML += `<option data-value=${item.alpha2Code} value="${item.country}">`;
    })
    self.showLoader('hide');
  })
};

// grabbing country specific informatin
Countries.prototype.getCountrySpecificInfo = function() {
  let self = this;
  self.$el.querySelector("#content-wrap").innerHTML = '';
  //grabbing the alpha code
  let val = this.$el.querySelector('#country').value,
      option = (val) ? this.$el.querySelector("#countries option[value='" + val + "']") : null,
      code = (option) ? option.dataset.value : null;
  // firing country api
  if (code) {
    this.showLoader('show');
    this.getCountriesInfo(`${apiEndpoints.getCountryInformation}/${code}`).then(function(response) {
      self.$el.querySelector("#content-wrap").innerHTML = self.createTemplate(response);
      self.showLoader('hide');
    });
  }else if(val && !code){ // if user tried to enter a country directly
    this.showError('Selected country not found !!');
  }else{ // no entry
    this.showError('Please select a country');
  }
};

// Creating data template
Countries.prototype.createTemplate = function(data) {
  return rows = `<h3>${data.name}</h3>
    <div class="countries-info">
      <div>
        <p>Capital : <span>${data.capital}</span></p>
        <p>Region : <span>${data.region}</span></p>
        <p>Population : <span>${data.population}</span></p>
        <p>Timezone : <span>${data.timezones}</span></p>
        <p>Area : <span>${data.area}</span></p>
      </div>
      <div>
        <img src="${data.flag}"  alt="${data.name} Flag"/>
      </div>
    </div>`;
};
//grabbing data from the api and returning promise
Countries.prototype.getCountriesInfo = function(endpoint) {
  let self = this;
  return new Promise(function(resolve, reject) {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (req.readyState === 4) {
        if (req.status === 200) {
          resolve(JSON.parse(req.responseText))
        } else {
          reject();
          self.showError(req.responseText)
        }
      }
    };
    req.open("GET", endpoint, true);
    req.send(null);
  });
};

// Error Handler
Countries.prototype.showError = function(error) {
  this.$el.querySelector("#content-wrap").innerHTML = `<p class='error-text'>${error}</p>`
  this.showLoader('hide');
};
// Loader Handler
Countries.prototype.showLoader = function(show) {
  let loader = this.$el.querySelector('#loading');
  loader.style.display = (show === 'show') ? 'block' : 'none'
};

//Global Init
this.init = function(config) {
  let countries = new Countries(config);
  return countries
}
