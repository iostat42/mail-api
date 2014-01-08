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
            all: ['core/test/*.js']
        },
        express: {
            dev: {
                options: {
                    script: './index.js',
                    output: 'Server started!'
                }
            }
        },
        watch: {
            dev: {
                files: ['**/*.js'],
                tasks: ['express:dev'],
                options: {
                    spawn: false
                },
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-express-server');

    grunt.registerTask('hoodiecrow', function () {
        var data = require('./core/test/data'),
            config = require('./config'),
            hoodiecrow = require('hoodiecrow')(data.hoodiecrow),
            done = this.async();

        hoodiecrow.listen(config.auth.testingtoken.imap.port, function () {
            done();
        });
    });

    grunt.registerTask('dev', [
        'express:dev',
        'watch:dev'
    ]);

    grunt.registerTask('validate', [
        'jshint',
        'mochacli'
    ]);

};
