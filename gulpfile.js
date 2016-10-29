'use strict';

var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');

var tsProject = ts.createProject('tsconfig.json',
    { typescript: require('typescript') });

//build typescript
gulp.task('default', function () {
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(ts(tsProject));
    return tsResult.pipe(gulp.dest('dist'));
});

// Copy bower & node_modules
/*gulp.task('config', function() {
    gulp.src('Config')
        .pipe(gulp.dest('dist'));
});*/

// Clean
/*gulp.task('clean', function(cb) {
    del(['dist/'], cb);
});*/

// Build task
/*gulp.task('default', ['scripts', 'config'], function() {

});*/