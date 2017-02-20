const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

gulp.task('serve', () => {
	browserSync.init({
		port: 80,
		server: {
			baseDir: ''
		}
	});
});

gulp.task('default', ['serve']);