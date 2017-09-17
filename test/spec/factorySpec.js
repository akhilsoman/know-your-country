describe("Countries", function() {
  var countries;

  beforeEach(function() {
    dom = `<div class="app-wrap">
      <h2> Know Your Country </h2>
      <div class="form-wrap">
        <input list="countries" name="countries" id="country" class="countries-input">
          <datalist id="countries"></datalist>
        <input type="submit" id="submit">
        <div class="loading" id="loading"> <img src="./assets/loading.svg" /> </div>
      </div>
      <div class="content-wrap" id="content-wrap">
      </div>
    </div>`;
    document.body.innerHTML += dom;
    countries = new Countries({});
  });
  describe("init function", function() {
    beforeEach(function() {
      //assert
      loaderFn = spyOn(countries, "showLoader").and.callThrough();
      apiFn = spyOn(countries, "getCountriesInfo").and.callThrough();
      //act
      countries.init();
    })
    it("should show the loader", function() {
      expect(loaderFn.calls.first().args[0]).toEqual('show');
    });
    it("should fire the getAllCountries API", function() {
      expect(apiFn).toHaveBeenCalledWith(apiEndpoints.getAllCountries);
    })
  })
  describe("handling ajax", function() {
    var doneFn, error;
    beforeEach(function() {
      jasmine.Ajax.install();
      errorFn = spyOn(countries, "showError").and.callThrough();
      // act
      promise = countries.getCountriesInfo(apiEndpoints.getAllCountries)
    });
    afterEach(function() {
      jasmine.Ajax.uninstall();
    });
    it("on load app should make first XHR request and return a promise", function() {
      // assert
      expect(jasmine.Ajax.requests.mostRecent().url).toBe('/api/getAllCountries');
      expect(countries.getCountriesInfo(apiEndpoints.getAllCountries)).toEqual(promise)
    });
    it("should call the success callback method on ajax-success", function(done) {
      jasmine.Ajax.requests.mostRecent().respondWith({
        "status": 200,
        "contentType": "application/json",
        "responseText": '[{"country":"Afghanistan","alpha2Code":"AF"}]'
      });
      promise.then(function(result) {
        expect(result).toEqual([{
          "country": "Afghanistan",
          "alpha2Code": "AF"
        }]);
        // expect(loadingFn).toHaveBeenCalledWith('hide');
        done()
      });
    });
    it("should call the error callback method on ajax-error", function() {
      jasmine.Ajax.requests.mostRecent().respondWith({
        "status": 500,
        "contentType": "application/json",
        "responseText": 'Something went wrong, Please try again after some time'
      });
      expect(errorFn).toHaveBeenCalledWith('Something went wrong, Please try again after some time');
    });
  });
  afterEach(function() {
    document.body.querySelector(".app-wrap").remove();
    dom = null;
  });
});
