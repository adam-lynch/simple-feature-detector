var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var semver = require('semver');
var inquirer = require('inquirer');

var paths = {};
paths.mainFile = './dev.js';
paths.endFileName = 'simple-feature-detector.min.js';
paths.endFile = './' + paths.endFileName;
paths.testRoot = './test/';
paths.testConfigRoot = paths.testRoot + 'config/';
paths.jasmineRoot = paths.testConfigRoot + 'jasmine/';
paths.testUtilsRoot = paths.testRoot + 'util/';
paths.testSuitesRoot = paths.testRoot + 'suites/';
paths.testRunnerFile = paths.testRoot + 'index.html';

gulp.task('default', ['bump']);

gulp.task('bump', ['compile'], function(done){
    inquirer.prompt({
        type: 'list',
        name: 'bump',
        message: 'What type of bump would you like to do?',
        choices: ['patch', 'minor', 'major', "don't bump"]
    }, function(result) {

        var shouldBump = result.bump !== "don't bump",
            oldVersion =  require('./package.json').version,
            newVersion =  shouldBump ? semver.inc(oldVersion, result.bump) : oldVersion;

        gulp.src(paths.endFile)
            .pipe($.insert.prepend('// simple-feature-detector v' + newVersion+ ' - https://github.com/adam-lynch/simple-feature-detector\n'))
            .pipe(gulp.dest('./'));

        if(!shouldBump){
            done();
            return;
        }

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
        paths.testConfigRoot + 'jasmine.phantomjs-reporter.js',
        paths.testUtilsRoot + '*.js',
        paths.endFile,
        paths.testSuitesRoot + '*.js'
    ])
        .pipe($.concat('script.js'))
        .pipe($.insert.append('\n' + [
            'jasmine.getEnv().addReporter(new jasmine.TrivialReporter());',
            'jasmine.getEnv().addReporter(new jasmine.PhantomJSReporter());',
            'jasmine.getEnv().execute();'
        ].join('\n')))
        .pipe(gulp.dest(paths.testRoot))
        .on('end', done);
});

gulp.task('compile', function(done){
    gulp.src(paths.mainFile)
        .pipe($.wrapUmd({
            namespace: 'SimpleFeatureDetector'
        }))
        //.pipe($.uglify())
        .pipe($.rename(paths.endFileName))
        .pipe(gulp.dest('./'))
        .on('end', done);
});