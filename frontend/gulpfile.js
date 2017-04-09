const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const plumber = require('gulp-plumber');
const minhtml = require('gulp-htmlmin');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const pump = require('pump');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('autoprefixer');
const runSequence = require('run-sequence');
const del = require('del');

gulp.task('html', () => {
    return gulp.src('src/modules/**/tpls/*.html', {base: 'src'})
            .pipe(plumber())
            .pipe(minhtml({collapseWhitespace: true}))
            .pipe(gulp.dest('dist'));
});

gulp.task('script', (cb) => {
    pump([
            gulp.src(['src/modules/**/**/*.js', 'src/services/*.js', 'src/directives/*.js'], {base: 'src'}),
            jshint(),
            uglify(),
            gulp.dest('dist')
        ], cb);
});

gulp.task('style', () => {
    return gulp.src('src/static/css/*.scss', {base: 'src'})
            .pipe(plumber())
            .pipe(postcss([autoprefixer]))
            .pipe(sass({outputStyle: 'compressed'}))
            .pipe(gulp.dest('dist'));
});

gulp.task('image', () => {
    return gulp.src('src/static/img/**/*', {base: 'src'})
            .pipe(plumber())
            .pipe(imagemin())
            .pipe(gulp.dest('dist'));
});

gulp.task('font', () => {
    return gulp.src('src/static/font/**/*', {base: 'src'})
            .pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist/*']));

gulp.task('watch', () => {
    runSequence('clean', 'html', 'font', 'style', 'script', 'image');
	browserSync.init({
		port: 80,
		server: {
			baseDir: './'
		}
	});
    gulp.watch('src/static/css/*.scss', ['style']);
    gulp.watch('src/static/img/*', ['image']);
    gulp.watch('src/modules/**/tpls/*.html', ['html']);
    gulp.watch(['src/modules/**/controllers/*.js', 'src/directives/*.js', 'src/services/*.js'], ['script']);
    gulp.watch([
        'src/*',
        ]).on('change', browserSync.reload);
});

gulp.task('default', ['watch']);