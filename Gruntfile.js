module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    jshint: {
      all: ["Gruntfile.js", "/public/javascripts/app/window.js", "*.js", "tests/*.js"],
      options: {
        jshintrc: ".jshintrc"
      }
    },
    jsbeautifier: {
      modify: {
        src: ["Gruntfile.js", "public/javascripts/app/window.js", "*.js", "tests/*.js"],
        options: {
          config: ".jsbeautifyrc"
        }
      },
      verify: {
        src: ["Gruntfile.js", "public/javascripts/app/window.js", "*.js", "tests/*.js"],
        options: {
          mode: "VERIFY_ONLY",
          config: ".jsbeautifyrc"
        }
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          "public/javascripts/build/app.min.js": [
            "public/javascripts/bower_components/jquery/jquery.js",
            "public/javascripts/bower_components/underscore/underscore.js",
            "public/javascripts/bower_components/backbone/backbone.js",
            "public/javascripts/bower_components/async/lib/async.js",
            "public/javascripts/bower_components/mustache/mustache.js",
            "public/javascripts/app/window.js"
          ]
        }
      }
    },
    cssmin: {
      add_banner: {
        options: {
          banner: "/* My minified css file */"
        },
        files: {
          "public/css/build/style.min.css": ["public/css/window.css"]
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-jsbeautifier");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask("clean", [
    "jsbeautifier:modify",
    "jshint"
  ]);

  grunt.registerTask("verify", [
    "jsbeautifier:verify",
    "jshint"
  ]);

  grunt.registerTask("build", [
    "cssmin",
    "uglify"
  ]);

};
