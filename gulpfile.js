var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var semver = require('semver');
var inquirer = require('inquirer');
var combine = require('stream-combiner');

var paths = {};
paths.mainFile = './simple-feature-detector.js';
paths.testRoot = './test/';
paths.testConfigRoot = paths.testRoot + 'config/';
paths.jasmineRoot = paths.testConfigRoot + 'jasmine/';
paths.testUtilsRoot = paths.testRoot + 'util/';
paths.testSuitesRoot = paths.testRoot + 'suites/';
paths.testRunnerFile = paths.testRoot + 'index.html';

var compile = combine(
    $.uglify({
        preserveComments: 'some'
    })
    .pipe($.rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('./'))
);

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

        gulp.src(paths.mainFile)
            .pipe($.replace(new RegExp('(simple-feature-detector v)' + oldVersion.replace('.', '\\.')), '$1' + newVersion))
            .pipe(gulp.dest('./'))
            .pipe(compile);

        gulp.src('./*.json')
            .pipe($.bump({
                version: newVersion
            }))
            .pipe(gulp.dest('./'));

        setTimeout(done, 200);
    });
});

gulp.task('test', ['compile', 'compile-test'], function(done){
    gulp.src(paths.testRunnerFile)
        .pipe($.exec([
                'phantomjs',
                paths.testConfigRoot + 'phantomjs_jasminexml_runner.js',
                paths.testRunnerFile,
                paths.testRoot + 'results'
        ].join(' ')))
        .on('end', done);
});

gulp.task('view-tests', ['compile', 'compile-test'], function(done){
    gulp.src(paths.testRunnerFile)
        .pipe($.open())
        .on('end', done);
});

gulp.task('compile-test', function(done){
    gulp.src([
        paths.jasmineRoot + 'jasmine.js',
        paths.jasmineRoot + 'jasmine-html.js',
        paths.jasmineRoot + 'jasmine.phantomjs-reporter.js',
        paths.testUtilsRoot + '*.js',
        './simple-feature-detector.min.js',
        paths.testSuitesRoot + '*.js'
    ])
        .pipe($.concat('script.js'))
        .pipe($.insert.append('\n' + [
            'jasmine.getEnv().addReporter(new jasmine.TrivialReporter());',
            'if(jasmine.PhantomJSReporter) jasmine.getEnv().addReporter(new jasmine.PhantomJSReporter());',
            'jasmine.getEnv().execute();'
        ].join('\n')))
        .pipe(gulp.dest(paths.testRoot))
        .on('end', done);
});

gulp.task('compile', function(done){
    gulp.src(paths.mainFile)
        .pipe(compile)
        .on('end', done);
});