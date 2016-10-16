/*
 * open http://localhost:3000/ in your browser.
 */

module.exports = function(grunt){
  'use strict'
  require('load-grunt-tasks')(grunt)
  grunt.initConfig({
    browserify:{
      dev:{
        src: './concise.js',
        dest: './build/bundle.js',
        options:{
          debug: true,
          watch: false,
          verbose: true,
          open: true
        }
      },
      release:{
        src: './concise.js',
        dest: './build/bundle.min.js',
        options:{
          debug: false,
          verbose: false
        }
      }
    },
    uglify:{
      build_target:{
        files:{
          './build/bundle.min.js': ['./build/bundle.min.js']
        }
      }
    }
  })
  grunt.registerTask('default', ['browserify:dev'])
  grunt.registerTask('release', ['browserify:release', 'uglify'])
}
