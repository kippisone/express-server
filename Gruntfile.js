module.exports = function(grunt) {
    'use strict';
    
    var pkg = grunt.file.readJSON('package.json');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bumpup: {
            file: 'package.json'
        },
        jshint: {
            dist: {
                options: {
                    jshintrc: '.jshintrc'
                },
                files: {
                    src: [
                        'modules/**/*.js',
                        'routes/**/*.js',
                        '*.js'
                    ]
                }
            }
        },
        tagrelease: {
            file: 'package.json',
            commit:  true,
            message: 'Release %version%',
            prefix:  'v',
            annotate: false,
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-tagrelease');

    grunt.registerTask('default', 'jshint');
    grunt.registerTask('build', [
        'jshint',
        'bumpup:prerelease']);

    grunt.registerTask('release', function (type) {
        type = type ? type : 'patch';     // Default release type 
        grunt.task.run('build');         // Lint stuff
        grunt.log.ok('Starting release ' + pkg.version); 
        grunt.task.run('bumpup:' + type); // Bump up the version 
        grunt.task.run('tagrelease');     // Commit & tag the release 
    });
};