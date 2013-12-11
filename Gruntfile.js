module.exports = function (grunt) {

     
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        jshint: {
            options: {
                jshintrc: true
            },
            all: ['core/**/*.js', 'test/*.js', 'config.js.dist', 'index.js']
        },
        mochacli: {
            options: {
                ui: 'bdd',
                reporter: 'spec'
            },
            all: ['test/*.js']
        },
        docco: {
            all: {
                src: ['core/routes/*.js'],
                options: {
                    output: 'docs/'
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-docco');
    
    grunt.registerTask('validate', [
        'jshint',
        'mochacli'
    ]);
    
    grunt.registerTask('docs', [
        'docco'
    ]);
    
    grunt.registerTask('default', []);

};