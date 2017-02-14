requirejs.config({
	baseUrl: './',
	paths: {
		angular: 'libs/angular/angular.min',
		jquery: 'libs/jquery/dist/jquery.min',
		bootstrap: 'libs/bootstrap/dist/js/bootstrap.min',
		uiRouter: 'libs/angular-ui-router/release/angular-ui-router.min'
	},
	shim: {
		angular: {
			exports: 'angular'
		},
		uiRouter: {
			deps: ['angular']
		}
	}
});

require(['angular', 'jquery', 'src/modules/app/controllers/app'], (angular, $, app) => {
	let injector = angular.bootstrap($('html'), [app.name]);
});