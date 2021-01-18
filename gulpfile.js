const gulp = require('gulp'),
    scss = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('scss-main', function() {
  return gulp.src('pages/main/*.scss')
    .pipe(scss())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(gulp.dest('pages/main'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('scss-pets', function() {
  return gulp.src('pages/pets/*.scss')
    .pipe(scss())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(gulp.dest('pages/pets'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: './',
    },
    notify: false
  });
});


gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('scss/**/*.scss', ['scss-main', 'scss-pets']);
  gulp.watch('pages/pets/*.scss', ['scss-pets']);
  gulp.watch('pages/main/*.scss', ['scss-main']);
  gulp.watch('pages/**/*.html', browserSync.reload);
  gulp.watch('pages/**/*.js', browserSync.reload);
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('default', ['watch']);