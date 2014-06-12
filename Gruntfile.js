/*
 * 
 *   
  
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
 * 
 */
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['client/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
    	mangle: true,
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      js: {
          dest: 'dist/<%= pkg.name %>.min.js',
          src:'<%= concat.dist.dest %>'
        }
    },jshint: {
    	  // define the files to lint
    	  files: ['client/*.js'],
    	  // configure JSHint (documented at http://www.jshint.com/docs/)
    	  options: {
    	      // more options here if you want to override JSHint defaults
    	    globals: {
    	      jQuery: true,
    	      console: true,
    	      module: true
    	    }
    	  }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    }
  });


  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  
  grunt.registerTask('default', ['jshint','concat', 'uglify']);

};
