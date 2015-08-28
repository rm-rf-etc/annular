
/*
 * open http://localhost:3000/ in your browser.
 */


var index = require('fs').readFileSync('./public/index.html')
// var browserSync = require('browser-sync')
// var browserSyncGrunt = require('grunt-browser-sync')

module.exports = function(grunt){
  'use strict'
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-browser-sync')
  grunt.loadNpmTasks('grunt-browserify')
  grunt.initConfig({
    watch:{
      source:{
        files: ['main.js', 'libs/*', 'ui/*'],
        tasks: ['browserify']
      },
      browsersync:{
        files: ['Gruntfile.js'],
        tasks: ['default']
      }
    },
    browserify:{
      dev:{
        src: './main.js',
        dest: 'public/scripts/bundle.js',
        options:{
          debug: true,
          watch: false,
          verbose: true,
          open: true
        }
      },
      release:{
        src: './main.js',
        dest: 'public/scripts/bundle.js',
        options:{
          debug: false,
          verbose: false
        }
      }
    },
    browserSync:{
      bsFiles:{
        src: ['public/scripts/*', 'public/styles/*', 'public/index.html', 'app/*']
      },
      options:{ // open http://localhost:3002/ in your browser.
        open: false,
        watchTask: true,
        server:{
          baseDir: './public',
          middleware: require('app/server/routing')
        }
      }
    }
  })
  grunt.registerTask('default', ['browserify:dev', 'browserSync', 'watch'])
  grunt.registerTask('release', ['browserify:release'])
}
