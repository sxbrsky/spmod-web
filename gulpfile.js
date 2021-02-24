const browserify = require('browserify')
const del = require('del')
const gulp = require('gulp')
const cleanCSS = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const styles = cb => {
    gulp.src('src/assets/scss/main.scss')
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(gulp.dest('htdocs/static/css'))

    cb()
}

const scripts = cb => {
    const b = browserify({
        entries: 'src/assets/js/main.js',
    })

    b.bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('htdocs/static/js'))

    cb()
}

const clean = cb => {
    del(['htdocs/static/**/*'])
    cb()
}

const watch = cb => {
    gulp.watch('src/assets/scss/*.scss', styles)
    gulp.watch('src/assets/js/*.js', scripts)

    cb()
}

const build = cb => {
    gulp.series(clean, gulp.parallel('styles', 'scripts'))()

    cb()
}

exports.scripts = scripts
exports.styles = styles
exports.watch = watch
exports.default = build
