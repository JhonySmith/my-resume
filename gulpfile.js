var gulp = require('gulp');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();

const htmlMin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const postcss = require('gulp-postcss');
const autoprfixer = require('autoprefixer');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const { stream } = require('browser-sync');

//server
const server = (done) => {
  browserSync.init({
    server: {
      baseDir: 'public',
      index: 'index.html',
    },
    ui: false,
  });
  done();
};

exports.default = server;

// html
const html = () => {
  return gulp
    .src('src/*.html')
    .pipe(htmlMin({ collapseWhitespace: true }))
    .pipe(gulp.dest('public'))
    .pipe(browserSync.stream());
};

exports.html = html;

// scss
const styles = () => {
  return gulp
    .src('src/style/style.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprfixer()]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream());
};

exports.styles = styles;

// copy
const copy = () => {
  return gulp.src(['src/fonts/**/*.{woff,woff2}']).pipe(gulp.dest('public/fonts'));
};

exports.copy = copy;

// img
const img = () => {
  return gulp.src(['src/img/**/*.{jpg,svg,png}']).pipe(gulp.dest('public/img'));
};

exports.copy = copy;

const watcher = () => {
  gulp.watch('src/*.html', gulp.series('html'));
  gulp.watch('src/style/**/*.scss', gulp.series('styles'));
};

const build = gulp.series(html, styles, copy, img);

exports.build = build;

exports.default = gulp.series(build, server, watcher);
