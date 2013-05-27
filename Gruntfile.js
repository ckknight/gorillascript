module.exports = function (grunt) {
  grunt.initConfig({
    gorilla: {
      dist: {
        files: {
          "lib/prism_gs.js": ["src/prism_gs.gs"],
          "lib/index.js": ["src/index.gs"]
        }
      }
    },
    concat: {
      dist: {
        src: [
          "src/prism.js",
          "lib/prism_gs.js",
          "node_modules/gorillascript/extras/gorillascript.js",
          "lib/index.js"
        ],
        dest: "lib/code.js"
      }
    },
    uglify: {
      dist: {
        files: {
          "lib/code.min.js": ["lib/code.js"]
        }
      }
    }
  });
  grunt.loadNpmTasks("grunt-gorilla");
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask("default", ["gorilla", "concat", "uglify"]);
};
