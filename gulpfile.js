const gulp = require('gulp');
const plumber = require('gulp-plumber');
const gutil = require('gulp-util');
const tap = require('gulp-tap');
const buffer = require('gulp-buffer');
const browserify = require('browserify');
const minify = require('gulp-minify');
const nodemon = require('gulp-nodemon');

const configPath = {
  'watcher': {
    'server': './app/server',
    'js_public': './app/client/assets/js/**/*.js'
  },
  'build': {
    'js': './app/client/assets/js/**/*.js',
    'js_main': './app/client/assets/js/main.js'
  },
  'output': {
    'js': './dist/assets/js',
    'js_minify': './dist/assets/js/main.js'
  }
};

gulp.task('dist::js', () => {
  gulp.src(configPath.build.js_main)
    .pipe(plumber((err) => {
      gutil.log(err.message);
      this.emit('end');
    }))
    .pipe(tap((file) => {
      file.contents = browserify(file.path)
        .bundle()
        .on('error', (err) => {
          gutil.log(err.stack);
          this.emit('end');
        });
    }))
    .pipe(buffer())
    .pipe(gulp.dest(configPath.output.js));
});

gulp.task('dist::js:watch', () => {
  gulp.watch(configPath.watcher.js_public, ['dist::js']);
});

gulp.task('server', () => {
  nodemon(
    {
      'exec': 'DEBUG=log* node app/server/index.js',
      'watch': configPath.watcher.server
    }
  );
});

gulp.task('default', [
  'dist::js',
  'dist::js:watch',
  'server'
]);