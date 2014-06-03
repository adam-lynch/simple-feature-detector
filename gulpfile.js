var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var semver = require('semver');
var combine = require('stream-combiner');
var inquirer = require('inquirer');

var mainFile = './simple-feature-detector.js';

gulp.task('default', ['bump']);

gulp.task('bump', function(done){
    inquirer.prompt({
        type: 'list',
        name: 'bump',
        message: 'What type of bump would you like to do?',
        choices: ['patch', 'minor', 'major', "don't bump"]
    }, function(result) {
        if (result.bump === "don't bump") {
            done();
            return;
        }

        var oldVersion =  require('./package.json').version,
            newVersion = semver.inc(oldVersion, result.bump);

        gulp.src(mainFile)
            .pipe($.replace(new RegExp('(simple-feature-detector v)' + oldVersion.replace('.', '\\.')), '$1' + newVersion))
            .pipe(gulp.dest('./'))
            .pipe($.uglify({
                preserveComments: 'some'
            }))
            .pipe($.rename({
                suffix: '.min'
            }))
            .pipe(gulp.dest('./'));

        gulp.src('./*.json')
            .pipe($.bump({
                version: newVersion
            }))
            .pipe(gulp.dest('./'));

        setTimeout(done, 200);
    });
});