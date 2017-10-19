var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var strip = require('gulp-strip-comments');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');
var shell = require('gulp-shell');
var run = require('run-sequence');
var del = require('del');
var imageMin = require('gulp-imagemin');
var templateCache = require('gulp-angular-templatecache');

var flags = require('yargs').argv;


var public = './angular/'
var src    = public+'/src/'
var build  = public+'/build/'
var vendor = require('./vendor.js');

var paths = {
  styles:  [src+'css/styles.scss',src+'css/*.scss',src+'css/**/*.scss'],
  images:  [src+'img/**'],
  scripts: [src+'js/*.js',src+'js/**/*.js'],
  markup:  [src+'views/*.html',src+'views/**/*.html'],
  json: [src+'img/*.json'],
  assets: [src+'assets']
};

gulp.task('build:vendor:js', function() {
  return gulp.src(vendor.scripts)
    .pipe(sourcemaps.init({loadMaps:true}))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(build))
});

gulp.task('build:images', function() {
  gulp.src(paths.images)
		// .pipe(imageMin([
    //   imageMin.gifsicle({interlaced: true}),
    //   imageMin.jpegtran({progressive: true}),
    //   imageMin.optipng({optimizationLevel: 5}),
    //   imageMin.svgo({plugins: [{removeViewBox: true}]})
    // ], {
    //   verbose: true
    // }))
		.pipe(gulp.dest(build + "/img"))
});

gulp.task('build:css', function() {
  return gulp.src(paths.styles[0])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('concat.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(build))
    .pipe(connect.reload());
});

gulp.task('build:js', function() {
  return gulp.src(paths.scripts)
    .pipe(strip())
    .pipe(ngAnnotate())
    .pipe(uglify({mangle:true}))
    .pipe(concat('concat.js'))
    .pipe(gulp.dest(build))
    .pipe(connect.reload());
});

gulp.task('build:html',function(){
  var task = gulp.src(paths.markup)
  .pipe(templateCache({
    root: 'views',
    standalone: true,
    module: 'templates',
    filename: 'templates.js'
  }))
  .pipe(gulp.dest(build))
  .pipe(connect.reload());
  return task;
})

gulp.task('watch:templates', function(){
    gulp.watch(paths.markup, ['build:templates'])
});

gulp.task('clean', function() {
  del.sync(build+'*');
});

gulp.task('watch:styles', function() {
  gulp.watch(paths.styles,  ['build:css']);
});

gulp.task('watch:scripts', function() {
  gulp.watch(paths.scripts, ['build:js']);
});

gulp.task('watch:partials', function() {
  gulp.watch(paths.markup,  ['build:html']);
});

gulp.task('serve', function () {
  connect.server({
    root: public,
    port: '3030',
    livereload: true,
    fallback: public+'index.html'
  });
});

gulp.task('build', ['clean', 'build:html', 'build:vendor:js', 'build:images', 'build:js', 'build:css']);
gulp.task('default', ['build']);
gulp.task('watch', ['watch:styles','watch:scripts','watch:partials']);

gulp.task('start', function(cb) {
  run('build', 'watch', 'serve', cb);
});
