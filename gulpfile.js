const gulp = require('gulp');
const gutil = require('gulp-util');

/* *************
  Config
************* */
const srcPath = 'src';
const distPath = 'dist';


/* *************
  CSS
************* */

const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const scss = require('postcss-scss');
const autoprefixer = require('autoprefixer');
const postcssProcessors = [
  autoprefixer( { browsers: ['last 2 versions', 'ie > 10'] } )
];

gulp.task('sassInline', function(callback) {
  return gulp.src(`${srcPath}/sass/*.scss`)
    .pipe(
      postcss(postcssProcessors, {syntax: scss})
    )
    .pipe(
      sass({ outputStyle: 'expanded' })
        .on('error', gutil.log)
    )
    .pipe(gulp.dest(`${distPath}/css/`));
});

gulp.task('sassEmbedded', function(callback) {
  return gulp.src(`${srcPath}/sass/*.scss`)
    .pipe(
      postcss(postcssProcessors, {syntax: scss})
    )
    .pipe(
      sass({ outputStyle: 'compressed' })
        .on('error', gutil.log)
    )
    .pipe(gulp.dest(`${distPath}/css/`));
});


const gulpJuice = require('./gulp-juice');

gulp.task('inlinecss', ['sassInline', 'nunjucks'], function() {
  return gulp.src(`${distPath}/*.html`)
    .pipe(
      gulpJuice({})
        .on('error', gutil.log)
    )
    .pipe(gulp.dest(`${distPath}/`))
    .pipe(connect.reload());
});



/* *************
  TEMPLATING
************* */

const nunjucksRender = require('gulp-nunjucks-render');

gulp.task('nunjucks', ['sassEmbedded'], function() {
  return gulp.src([`${srcPath}/emails/*.html`])
    .pipe(
      nunjucksRender({
        path: [`${srcPath}/templates`, `${srcPath}/layouts`]
      })
        .on('error', gutil.log)
    )
    .pipe(gulp.dest(`${distPath}/`));
});



/* *************
  SERVER
************* */

const connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    port: 8000,
    root: distPath, // Serve from build directory instead,
    livereload:true
  });
});



/* *************
  WATCH
************* */

const filesToWatch = [
  `${srcPath}/sass/**/*.scss`,
  `${srcPath}/**/*.html`
];

gulp.task('watch', function() {
  gulp.watch(filesToWatch,['nunjucks', 'inlinecss']);
});

gulp.task('watch-dev', function() {
  gulp.watch(filesToWatch,['nunjucks', 'inlinecss']);
});


/* *************
  DEFAULT
************* */

gulp.task('default', ['connect', 'nunjucks', 'inlinecss', 'watch']);
gulp.task('dev', ['connect', 'nunjucks', 'watch-dev']);

