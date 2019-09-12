const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? true : false;
const projectName = 'sushkapola.ru';

// Modules

var gulp = require('gulp');
var webpack = require('webpack-stream');

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');

var uglify = require('gulp-terser');

var pug = require('gulp-pug');

var imagemin = require('gulp-imagemin');

var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var gulpIf = require('gulp-if');
var rename = require('gulp-rename');
var zip = require('gulp-zip');
var del = require('del');

var browserSync = require('browser-sync').create();

// Tasks

gulp.task('dev:styles', function() {
	return gulp.src('app/src/sass/main.sass')
		.pipe(plumber())
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(sass({ outputStyle: 'expanded' }))
		.pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(gulp.dest('app/public/css/'))
})

gulp.task('dev:scripts', function() {
	return gulp.src('app/src/js/main.js')
		.pipe(webpack( require('./webpack.config') ))
		.pipe(gulp.dest(isDevelopment ? 'app/public/js/' : 'dist/js/'))
})

gulp.task('dev:markup', function() {
	return gulp.src('app/src/pug/pages/*.pug')
		.pipe(pug({ pretty: true }))
		.pipe(gulp.dest('app/public/'))
})

gulp.task('dev:server', function() {
	browserSync.init({
		server: {
			baseDir: 'app/public/'
		}
	})
	browserSync.watch('app/public/**/*').on('change', browserSync.reload);
})

gulp.task('dev:watch', function() {
	gulp.watch('app/src/sass/**/*.(sass|scss)', gulp.parallel('dev:styles'));
	gulp.watch([ 'app/src/js/**/*.js', 'app/src/libs/**/*.js' ], gulp.parallel('dev:scripts'));
	gulp.watch('app/src/pug/**/*.pug', gulp.parallel('dev:markup'));
})

gulp.task('dev:all', gulp.parallel('dev:server', 'dev:watch'));


gulp.task('deploy:styles', function() {
	return gulp.src('app/public/css/main.css')
		.pipe(plumber())
		.pipe(autoprefixer())
		.pipe(csso())
		.pipe(gulp.dest('dist/css/'))
})

gulp.task('deploy:scripts', function() {
	return gulp.src('app/src/js/main.js')
		.pipe(webpack( require('./webpack.config') ))
		.pipe(gulp.dest('dist/js/'))
})

gulp.task('deploy:markup', function() {
	return gulp.src('app/public/*.html')
		.pipe(gulp.dest('dist/'))
})

gulp.task('deploy:img', function() {
	return gulp.src('app/public/img/**/*')
		.pipe(imagemin([
			imagemin.optipng({ optimizationLevel: 4 }),
			imagemin.jpegtran({ progressive: true })
		]))
		.pipe(gulp.dest('dist/img/'))
})

gulp.task('deploy:fonts', function() {
	return gulp.src('app/public/fonts/**/*')
		.pipe(gulp.dest('dist/fonts/'))
})

gulp.task('deploy:assets', function() {
	return gulp.src('public/assets/**/*')
		.pipe(gulp.dest('dist/'))
})

gulp.task('deploy:clean', function() {
	return del('dist');
})

gulp.task('deploy:zip', function() {
	return gulp.src('dist/**/*')
		.pipe(zip(`${projectName}.zip`))
		.pipe(gulp.dest('./'))
})

gulp.task('deploy:all', gulp.series(
	'deploy:clean',
	gulp.parallel(
		gulp.series('dev:styles', 'deploy:styles'),
		'deploy:scripts',
		gulp.series('dev:markup', 'deploy:markup'),
		'deploy:img',
		'deploy:fonts',
		'deploy:assets',
	),
	'deploy:zip'
))

gulp.task('default', isDevelopment ? gulp.parallel('dev:all') : gulp.parallel('deploy:all'));
