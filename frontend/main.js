requirejs.config({
	baseUrl: './',
	paths: {
		angular: 'libs/angular/angular.min',
		jquery: 'libs/jquery/dist/jquery.min',
		bootstrap: 'libs/bootstrap/dist/js/bootstrap.min'
	},
	shim: {
		angular: {
			exports: 'angular'
		}
	}
});

require(['angular', 'jquery', 'src/modules/app/controllers/app'], (angular, $, app) => {
	angular.bootstrap($('html', app.name))
});