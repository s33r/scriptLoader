var packageJSON  = require('./package');
var jshintConfig = packageJSON.jshintConfig;

var gulp       = require('gulp');
var uglify     = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename     = require("gulp-rename");
var jshint     = require('gulp-jshint');
var bump       = require('gulp-bump');
var header     = require('gulp-header');
var del        = require('del');

var banner = '//<%= pkg.name %> <%= pkg.license %> License (c) 2015 <%= pkg.author %>\n';

//////////////////////////////////////////////////////////////////////////////
// Build
//////////////////////////////////////////////////////////////////////////////
gulp.task('cleanBuild', function (cb) {
	del([
		'./build/**/**'
	], cb);
});

gulp.task('lint', function () {
	return gulp.src('./src/*.js')
		.pipe(jshint(jshintConfig))
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});

gulp.task('copy', ['cleanBuild'], function (cb) {
	return gulp.src('./src/loader.js')
		.pipe(header(banner, {pkg: packageJSON}))
		.pipe(gulp.dest('./build'));
});

gulp.task('copyDoc', ['cleanBuild'], function (cb) {
	return gulp.src('./doc/**/**')
		.pipe(gulp.dest('./build/doc'));
});

gulp.task('compress', ['copy', 'copyDoc', 'cleanBuild'], function (cb) {
	return gulp.src('./build/loader.js')
		.pipe(sourcemaps.init())
		.pipe(uglify({preserveComments: 'some'}))
		.pipe(header(banner, {pkg: packageJSON}))
		.pipe(rename('loader.min.js'))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('./build'));
});

gulp.task('build', ['compress', 'lint'], function (cb) {
	cb();
});

//////////////////////////////////////////////////////////////////////////////
// Release
//////////////////////////////////////////////////////////////////////////////
gulp.task('cleanDist', function (cb) {
	del([
		'./dist/**/**'
	], cb);
});

gulp.task('copyBuild', ['cleanDist'], function (cb) {
	return gulp.src('./build/**/**')
		.pipe(gulp.dest('./dist'));
});

gulp.task('bump', function (cb) {
	gulp.src(['./package.json', './bower.json'])
		.pipe(bump({type: 'patch', indent: 4}))
		.pipe(gulp.dest('./'));
});

gulp.task('release', ['bump', 'copyBuild'], function (cb) {
	cb();
});

//////////////////////////////////////////////////////////////////////////////
// Default
//////////////////////////////////////////////////////////////////////////////
gulp.task('default', ['build'], function (cb) {
	cb();
});