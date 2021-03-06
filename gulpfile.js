const gulp = require('gulp');
const { series, watch } = require('gulp');
const { src, dest } = require('gulp');
const path = require('path');
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('./package.json'));
const assetsPath = path.resolve(pkg.path.assetsDir);
const browserSync = require('browser-sync').create();

const sass = require('gulp-sass');

const autoprefixer = require('gulp-autoprefixer');

const plumber = require('gulp-plumber');

function compileSass() {
  // 1. define the path for scss file - `* is all`
  return gulp.src(path.join(assetsPath, 'scss/*.scss'))
    .pipe(plumber())
  // 2. compile sass
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserlist: ['last 2 versions'],
      cascade: false
    }))
  // 3. save sass
    .pipe(gulp.dest(path.join(assetsPath, 'css')))
  // 4. syncronize all the browser
    .pipe(browserSync.stream());
}

function watchFiles() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  gulp.watch(path.join(assetsPath, 'scss/*.scss'), compileSass);
  gulp.watch('./*.html').on('change', browserSync.reload);
  gulp.watch(path.join(assetsPath, 'js/*.js')).on('change', browserSync.reload);
}

exports.default = series(compileSass, watchFiles);
