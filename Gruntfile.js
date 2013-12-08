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
    }
  });

  grunt.loadNpmTasks("grunt-jsbeautifier");
  grunt.loadNpmTasks("grunt-contrib-jshint");

  grunt.registerTask("clean", [
    "jsbeautifier:modify",
    "jshint"
  ]);

  grunt.registerTask("verify", [
    "jsbeautifier:verify",
    "jshint"
  ]);

};
