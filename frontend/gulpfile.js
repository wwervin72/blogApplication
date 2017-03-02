const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const runSequence = require('run-sequence');
const del = require('del');

gulp.task('style', () => {
    gulp.src('src/static/css/style.scss', {base: 'src'})
            .pipe(plumber())
            .pipe(postcss([autoprefixer]))
            .pipe(sass({outputStyle: 'compressed'}))
            .pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist/*']));

gulp.task('serve', () => {
    runSequence('clean', 'style');
	browserSync.init({
		port: 80,
		server: {
			baseDir: './'
		}
	});
    gulp.watch('src/static/css/*.scss', ['style']);
    gulp.watch([
        'src/static/css/*.scss'
        ]).on('change', browserSync.reload);
});

gulp.task('default', ['serve']);