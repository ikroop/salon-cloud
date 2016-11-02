'use strict';

var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');

var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var codecov = require('gulp-codecov');

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
    gulp.src('Config/**/*')
        .pipe(gulp.dest('dist/Config'));
});

// Clean
gulp.task('clean', function (cb) {
    del.sync(['dist/'], cb);
});

gulp.task('pre-test', function () {
    return gulp.src(['dist/**/*.js'])
        // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
    return gulp.src(['spec/*.js'])
        .pipe(mocha({
            reporter: 'spec',
            globals: {
                should: require('should')
            }
        }))
        // Creating the reports after tests ran
        .pipe(istanbul.writeReports({
            dir: './spec/coverage',
            reportOpts: {
                dir: './spec/coverage'
            },
            reporters: ['lcov'],
        }))
        // Enforce a coverage of at least 90%
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 5 } }))
        .once('error', () => {
            process.exit(1);
        })
        .once('end', () => {
            process.exit();
        });
});
gulp.task('codecov', ['test'], function () {
    gulp.src('./spec/coverage/lcov.info')
        .pipe(codecov());
});

// Build task
gulp.task('default', ['clean', 'config', 'scripts']);