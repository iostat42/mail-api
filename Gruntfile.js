/*jslint node: true */
"use strict";

module.exports = function (grunt) {

     
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        jshint: {
            options: {
                jshintrc: true
            },
            all: ['core/**/*.js', 'test/*.js']
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    
    grunt.registerTask('validate', [
        'jshint'
    ]);
    
    grunt.registerTask('default', []);

};