const exec = require('child_process').exec;
const minimist = require('minimist');
const merge = require('merge-stream');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const ifelse = require('gulp-if-else');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const webpack = require('webpack-stream');

const conf = minimist(process.argv.slice(2), {
  default: {
    env: 'dev',
    autoprefixer: {},
    cssnano: {
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true,
          },
        },
      ]
    },
    webpack: require('./webpack.config.js'),
  },
});

const bundle = {
  clear: function (cb) {
    exec('rm -fr ./dist/bundle', cb);
  },
  scss: function () {
    return gulp.src([
        './src/scss/vendor.scss',
        './src/scss/main.scss',
      ])
      .pipe(plumber())
      .pipe(sass().on('error', sass.logError))
      .pipe(ifelse(conf.env == 'prod', function() {
        return postcss([
          autoprefixer(conf.autoprefixer),
          cssnano(conf.cssnano),
        ]);
      }, function() {
        return postcss([
          autoprefixer(conf.autoprefixer),
        ]);
      }))
      .pipe(gulp.dest('./dist/bundle/css'))
    ;
  },
  js: function () {
    return gulp.src('./webpack.config.js')
      .pipe(plumber())
      .pipe(ifelse(conf.env == 'dev', function() {
        return webpack(conf.webpack.dev);
      }, function() {
        return webpack(conf.webpack.prod);
      }))
      .pipe(gulp.dest('./dist/bundle/js'))
    ;
  },
};

const plugin = {
  clear: function (cb) {
    exec('rm -fr ./dist/plugin', cb);
  },
  swiper: function () {
    const css = gulp
      .src('./node_modules/swiper/css/swiper.min.css')
      .pipe(plumber())
      .pipe(gulp.dest('./dist/plugin/swiper/css'))
    ;

    const js = gulp
      .src('./node_modules/swiper/js/swiper.min.js')
      .pipe(plumber())
      .pipe(gulp.dest('./dist/plugin/swiper/js'))
    ;

    return merge(css, js);
  },
};

exports.build = gulp.parallel(
  gulp.series(
    bundle.clear,
    gulp.parallel(bundle.scss, bundle.js)
  ),
  gulp.series(
    plugin.clear,
    gulp.parallel(plugin.swiper)
  )
);
