var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('default', ['minify']);

gulp.task('minify', function(done){
   gulp.src('./simple-feature-detector.js')
       .pipe($.uglify({
           preserveComments: 'some'
       }))
       .pipe($.rename({
           suffix: '.min'
       }))
       .pipe(gulp.dest('./'))
       .on('end', done);
});

gulp.task('bump', function(done){
    gulp.src('./simple-feature-detector.js')
        .pipe($.replace(/(simple-feature-detector v)[0-9]+\.[0-9]+\.[0-9]+( - )/, '$1' + newVersion + '$2'))
});