'use strict';

var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');

var tsProject = ts.createProject('tsconfig.json',
    { typescript: require('typescript') });

//build typescript
gulp.task('scripts', function () {
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(ts(tsProject));
    return tsResult.pipe(gulp.dest('dist'));
});

// Copy Config folder
gulp.task('config', function () {
    gulp.src('src/Config/**/*')
        .pipe(gulp.dest('dist/Config'));
});

// Clean
gulp.task('clean', function (cb) {
    del.sync(['dist/'], cb);
});

// Build task
gulp.task('default', ['clean','config', 'scripts']);