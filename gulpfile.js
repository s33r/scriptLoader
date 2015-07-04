var packageJSON  = require('./package');
var jshintConfig = packageJSON.jshintConfig;

var gulp       = require('gulp');
var uglify     = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename     = require("gulp-rename");
var jshint     = require('gulp-jshint');
var bump       = require('gulp-bump');
var del        = require('del');


//////////////////////////////////////////////////////////////////////////////
// Clean
//////////////////////////////////////////////////////////////////////////////
gulp.task('clean', function (cb) {
	del([
		'./dist/**/**'
	], cb);
});

//////////////////////////////////////////////////////////////////////////////
// Build
//////////////////////////////////////////////////////////////////////////////
gulp.task('lint', function () {
	return gulp.src('./src/*.js')
		.pipe(jshint(jshintConfig))
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});

gulp.task('copy', function (cb) {
	return gulp.src(['./src/loader.js', './doc/example.html'])
		.pipe(gulp.dest('./dist'));
});

gulp.task('compress', ['copy'], function (cb) {
	return gulp.src('./dist/loader.js')
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(rename('loader.min.js'))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('build', ['compress', 'lint'], function (cb) {
	cb();
});


//////////////////////////////////////////////////////////////////////////////
// Release
//////////////////////////////////////////////////////////////////////////////
gulp.task('bump', function (cb) {
	gulp.src(['./package.json', './bower.json'])
		.pipe(bump({type: 'patch', indent: 4}))
		.pipe(gulp.dest('./'));
});

gulp.task('release', ['bump'], function (cb) {
	cb();
});

//////////////////////////////////////////////////////////////////////////////
// Default
//////////////////////////////////////////////////////////////////////////////
gulp.task('default', ['build'], function (cb) {
	cb();
});