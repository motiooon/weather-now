var assert = chai.assert;

describe("Model", function () {

	var weatherWidget;

	before(function(){
		weatherWidget = new WeatherNowExtension.WeatherNow.Models.Weather();
	});

	describe("Should fetch", function () {
    it("should get attributes when fetch is called", function (done) {

	    weatherWidget.fetch({
		    data: {
			    q: "New York"
		    },
		    dataType: "jsonp",
		    complete: function(){
			    console.log(weatherWidget);
			    assert.equal(weatherWidget.get("name"), "New York");
			    assert.typeOf(weatherWidget.get("user_friendly_temp"), "object", "user_friendly_temp should be an object");
			    assert.equal(Object.keys(weatherWidget.get("user_friendly_temp")).length, 3, "user_friendly_temp should have 3 keys");
			    done();
		    }
	    });

    });
  });

	describe("Should be able to set values", function () {
		it("sets correctly the city", function () {
			weatherWidget.set("name", "Berlin");
			assert.equal(weatherWidget.get("name"), "Berlin");
		});
	});

});

describe("Views", function () {

	var weatherWidget;

	before(function(){
		weatherWidget = new WeatherNowExtension.WeatherNow.Models.Weather();
	});

	it("WeatherNow.Views.WeatherWidgetViewLeft should initialize", function () {
		var view = new WeatherNowExtension.WeatherNow.Views.WeatherWidgetViewLeft({
			model: weatherWidget
		});
		assert.equal(view.$el.selector, "#weather_view");
	});


	it("WeatherNow.Views.WeatherWidgetViewLeftSettings should initialize", function () {
		var view = new WeatherNowExtension.WeatherNow.Views.WeatherWidgetViewLeftSettings({
			model: weatherWidget
		});
		assert.equal(view.$el.selector, "#settings_view");
	});


	it("WeatherNow.Views.WeatherWidgetViewTopRight should initialize", function () {
		var view = new WeatherNowExtension.WeatherNow.Views.WeatherWidgetViewTopRight({
			model: weatherWidget
		});
		assert.equal(view.$el.selector, "#r_top");
	});


	it("WeatherNow.Views.WeatherWidgetViewBottomRight should initialize", function () {
		var view = new WeatherNowExtension.WeatherNow.Views.WeatherWidgetViewBottomRight({
			model: weatherWidget
		});
		assert.equal(view.$el.selector, "#r_bottom");
	});

});
