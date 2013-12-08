var WeatherNowExtension = (function () {

  var WeatherNow = {};
  WeatherNow.Models = {};
  WeatherNow.Views = {};
  var weatherWidget;

  // For global pub/sub within the widget
  Backbone.Notifications = {};
  _.extend(Backbone.Notifications, Backbone.Events);

  WeatherNow.WeatherConditionMapping = {
    "01d": "/public/images/images/sky_is_clear_day.jpg",
    "01n": "/public/images/images/sky_is_clear_night.jpg",
    "02d": "/public/images/images/few_clouds_day.jpg",
    "02n": "/public/images/images/few_clouds_night.jpg",
    "03d": "/public/images/images/scattered_clouds.jpg",
    "03n": "/public/images/images/scattered_clouds.jpg",
    "04d": "/public/images/images/broken_clouds.jpg",
    "04n": "/public/images/images/broken_clouds.jpg",
    "09d": "/public/images/images/shower_rain.jpg",
    "09n": "/public/images/images/shower_rain.jpg",
    "10d": "/public/images/images/rain.jpg",
    "10n": "/public/images/images/rain.jpg",
    "11d": "/public/images/images/thunderstorm.jpg",
    "11n": "/public/images/images/thunderstorm.jpg",
    "13d": "/public/images/images/snow.jpg",
    "13n": "/public/images/images/snow.jpg",
    "50d": "/public/images/images/mist.png",
    "50n": "/public/images/images/mist.png"
  };

  WeatherNow.Utils = {
    kelvin_to_fahrenheit: function (deg) {
      //°F = K × 1.8 - 459.67
      return Math.floor(deg * 1.8 - 459.67);
    },
    kelvin_to_celsius: function (deg) {
      //°C = K - 273.15
      return Math.floor(deg - 273.15);
    }
  };

  WeatherNow.Models.Weather = Backbone.Model.extend({

    url: function () {
      return "http://api.openweathermap.org/data/2.5/weather";
    },

    parse: function (data) {

      if (data.weather) {
        var _weather = data.weather[0];

        return _.extend(data, {
          user_friendly_temp: {
            fahrenheit: WeatherNow.Utils.kelvin_to_fahrenheit(data.main.temp),
            celsius: WeatherNow.Utils.kelvin_to_celsius(data.main.temp),
            image_src: WeatherNow.WeatherConditionMapping[_weather.icon]
          }
        });
      } else {
        return {};
      }
    }

  });

  WeatherNow.Views.WeatherWidgetViewLeft = Backbone.View.extend({
    el: "#weather_view",
    template: $("#widget_left").html(),

    events: {
      "click #settings": "openSettings"
    },

    initialize: function () {
      this.listenTo(this.model, "change", this.render);
      Backbone.Notifications.on("closeSettings", this.render.bind(this));
    },

    openSettings: function () {
      this.$el.addClass("hide");
      Backbone.Notifications.trigger("openSettings");
    },

    render: function () {

      var self = this;

      WeatherNow.UserSettings.get(function (err, settings) {

        console.log("settings", settings);

        self.$el.html(Mustache.render(self.template, _.extend(self.model.attributes, {
          f: settings.wwSettings.scale === "c" ? false : true
        }))).removeClass("hide");
      });

    }
  });

  WeatherNow.Views.WeatherWidgetViewLeftSettings = Backbone.View.extend({
    el: "#settings_view",
    template: $("#widget_left_settings").html(),

    events: {
      "click #apply": "closeSettings",
      "click #fahrenheit": "setFahrenheit",
      "click #celsius": "setCelsius",
      "keydown #city_name": "setCity"
    },

    initialize: function () {
      Backbone.Notifications.on("openSettings", this.render.bind(this));
      _.bindAll(this, "setCity", "setCelsius", "setFahrenheit", "closeSettings");
    },

    setCity: function (e) {
      if (e.keyCode === 13) {
        return this.closeSettings();
      }
    },

    setFahrenheit: function () {
      WeatherNow.UserSettings.set({
        city: "New York",
        scale: "f"
      }, function (err, sett) {
        WeatherNow.UserSettings.cache.wwSettings.scale = "f";
      });
    },

    setCelsius: function () {
      WeatherNow.UserSettings.set({
        city: "New York",
        scale: "c"
      }, function (err, sett) {
        WeatherNow.UserSettings.cache.wwSettings.scale = "c";
      });
    },

    closeSettings: function () {
      this.$el.addClass("hide");
      var city_name = this.$el.find("#city_name").val();

      WeatherNow.UserSettings.set({
        city: city_name,
        scale: WeatherNow.UserSettings.cache ? WeatherNow.UserSettings.cache.wwSettings.scale : "f"
      }, function (err, sett) {
        Backbone.Notifications.trigger("closeSettings");
        weatherWidget.fetch({
          data: {
            q: city_name
          }
        });
      });

    },

    render: function () {
      this.$el.html(Mustache.render(this.template, this.model.attributes)).removeClass("hide");
      this.$el.find("#city_name").focus();
    }
  });

  WeatherNow.Views.WeatherWidgetViewTopRight = Backbone.View.extend({
    el: "#r_top",
    template: $("#widget_r_top").html(),

    initialize: function () {
      this.listenTo(this.model, "change", this.render);
    },

    render: function () {
      this.$el.html(Mustache.render(this.template, this.model.attributes));
    }
  });

  WeatherNow.Views.WeatherWidgetViewBottomRight = Backbone.View.extend({
    el: "#r_bottom",
    template: $("#widget_r_bottom").html(),

    initialize: function () {
      this.listenTo(this.model, "change", this.render);
    },

    render: function () {
      this.$el.html(Mustache.render(this.template, this.model.attributes));
    }
  });

  WeatherNow.UserSettings = {
    get: function (cb) {

      if (WeatherNow.UserSettings.cache) {
        return cb(null, WeatherNow.UserSettings.cache);
      } else {
        chrome.storage.local.get("wwSettings", function (settings) {
          if (settings.wwSettings && settings.wwSettings.city) {
            return cb(null, settings);
          } else {
            return cb(null, {
              "wwSettings": {
                city: "New York",
                scale: "f"
              }
            });
          }
        });
      }

    },
    set: function (settings, callback) {
      var _sett = {
        "wwSettings": _.extend({}, _.pick(settings, "city", "scale"))
      };
      chrome.storage.local.set(_sett, function () {
        WeatherNow.UserSettings.cache = _sett;
        callback(null, "Settings saved");
      });
    }
  };

  WeatherNow.UserSettings.cache = null;

  var init = function () {
    weatherWidget = new WeatherNow.Models.Weather();
    new WeatherNow.Views.WeatherWidgetViewLeft({
      model: weatherWidget
    });
    new WeatherNow.Views.WeatherWidgetViewLeftSettings({
      model: weatherWidget
    });
    new WeatherNow.Views.WeatherWidgetViewTopRight({
      model: weatherWidget
    });
    new WeatherNow.Views.WeatherWidgetViewBottomRight({
      model: weatherWidget
    });

    async.waterfall([

      function getUserSettings(callback) {
        var result = {};
        WeatherNow.UserSettings.get(function (err, settings) {
          result.user_settings = settings;
          callback(err, result);
        });

      }

    ], function (err, result) {
      weatherWidget.fetch({
        data: {
          q: result.user_settings.wwSettings.city
        }
      });
    });

  };

  return {
    init: init
  };

})();

WeatherNowExtension.init();
