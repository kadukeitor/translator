module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    grunt.config.init({
        mkdir: {
            all: {
                options: {
                    create: ['dist', 'dist/css', 'dist/fonts', 'dist/js', 'dist/partials', 'dist/lib']
                }
            }
        },
        cssmin: {
            core: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/css/',
                        src: ['*.css', '!*.min.css'],
                        dest: 'dist/css/',
                        ext: '.min.css'
                    }
                ]
            }
        },
        copy: {
            fonts: {
                expand: true,
                cwd: 'src/fonts',
                src: '**/*',
                dest: 'dist/fonts'
            },
            partials: {
                expand: true,
                cwd: 'src/partials',
                src: '**/*',
                dest: 'dist/partials'
            },
            libs: {
                expand: true,
                cwd: 'bower_components',
                src: '**/*',
                dest: 'dist/lib'
            }
        },
        concat: {
            core: {
                src: [
                    'src/js/app.js',
                    'src/js/services.js',
                    'src/js/controllers.js'
                ],
                dest: 'dist/js/translator.js'
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            core: {
                src: '<%= concat.core.dest %>',
                dest: 'dist/js/translator.min.js'
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'src/index.html'
                }
            }
        },
        connect: {
            server: {
                options: {
                    hostname: '127.0.0.1',
                    port: 9001,
                    base: 'dist',
                    keepalive: true,
                    open: true
                }
            }
        }
    });

    grunt.registerTask('default', ['mkdir', 'cssmin:core', 'copy:fonts', 'copy:partials', 'copy:libs', 'concat:core', 'uglify:core', 'htmlmin']);
    grunt.registerTask('serve', ['default', 'connect']);
};
