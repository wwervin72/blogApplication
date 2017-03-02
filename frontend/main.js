requirejs.config({
	baseUrl: './',
	paths: {
		angular: 'libs/angular/angular.min',
		jquery: 'libs/jquery/dist/jquery.min',
		bootstrap: 'libs/bootstrap/dist/js/bootstrap.min',
		uiRouter: 'libs/angular-ui-router/release/angular-ui-router.min',
		ngCookies: 'libs/angular-cookies/angular-cookies.min',
		oclazyload: 'libs/oclazyload/dist/ocLazyLoad.require.min',
		app: 'src/modules/app/controllers/app',
		home: 'src/modules/home/controllers/home.controller',
		articles: 'src/modules/articles/controllers/articles.controller',
		user: 'src/modules/user/controllers/user.controller',
		article: 'src/modules/article/controllers/article.controller',
		createPost: 'src/modules/createPost/controllers/createPost.controller',
		updatePost: 'src/modules/updatePost/controllers/updatePost.controller'

	},
	shim: {
		angular: {
			exports: 'angular'
		},
		uiRouter: {
			deps: ['angular']
		},
		app: {
			deps: ['oclazyload', 'uiRouter']
		}
	}
});

require(['angular', 'jquery', 'app'], (angular, $, app) => {
	let injector = angular.bootstrap($('html'), [app.name]);
});