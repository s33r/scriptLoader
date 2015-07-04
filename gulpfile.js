var gulp       = require('gulp');
var uglify     = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename     = require("gulp-rename");
var jshint     = require('gulp-jshint');
var del        = require('del');

gulp.task('clean', function (cb) {
	del([
		'dist/**/*'
	], cb);
});

gulp.task('lint', function () {
	return gulp.src('./src/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('copy', ['clean'], function (cb) {
	return gulp.src(['./src/loader.js', './doc/example.html'])
		.pipe(gulp.dest('./dist'));
});

gulp.task('compress', ['clean', 'copy'], function (cb) {
	return gulp.src('./dist/loader.js')
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(rename('loader.min.js'))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('default', ['compress', 'lint'], function (cb) {

});