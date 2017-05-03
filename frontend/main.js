requirejs.config({
	baseUrl: './',
	paths: {
		//第三方插件
		angular: 'libs/angular/angular.min',
		jquery: 'libs/jquery/dist/jquery.min',
		bootstrap: 'libs/bootstrap/dist/js/bootstrap.min',
		uiRouter: 'libs/angular-ui-router/release/angular-ui-router.min',
		ngCookies: 'libs/angular-cookies/angular-cookies.min',
		oclazyload: 'libs/oclazyload/dist/ocLazyLoad.require.min',
		sanizite: 'libs/angular-sanitize/angular-sanitize.min',
		simplemde: 'libs/simplemde/dist/simplemde.min',
		marked: 'libs/marked/marked.min',
		toastr: 'libs/toastr/toastr.min',
		// 封装的指令
		carousel: 'dist/directives/carousel.directive',
		pagination: 'dist/directives/pagination.directive',
		// 封装的服务
		markdownService: 'dist/services/markdown.service',
		httpRequest: 'dist/services/http.service',
		particle: 'dist/services/particle.service',
		message: 'dist/services/message.service',
		// 模块
		app: 'dist/modules/app/controllers/app',
		home: 'dist/modules/home/controllers/home.controller',
		articles: 'dist/modules/articles/controllers/articles.controller',
		user: 'dist/modules/user/controllers/user.controller',
		article: 'dist/modules/article/controllers/article.controller',
		createArticle: 'dist/modules/createArticle/controllers/createArticle.controller',
		updateArticle: 'dist/modules/updateArticle/controllers/updateArticle.controller',
		settings: 'dist/modules/user/controllers/settings.controller',
		findPwd: 'dist/modules/user/controllers/findPwd.controller',
		// ervin
		ervin: 'dist/modules/ervin/controllers/ervin.controller'
	},
	shim: {
		angular: {
			exports: 'angular'
		},
		uiRouter: {
			deps: ['angular']
		},
		oclazyload: {
			deps: ['angular']
		},
		sanizite: {
			deps: ['angular']
		},
		ngCookies: {
			deps: ['angular']	
		},
		carousel: {
			deps: ['sanizite']
		},
		httpRequest: {
			deps: ['angular']
		},
		particle: {
			exports: 'particle'
		},
		message: {
			deps: ['angular', 'toastr']
		},
		marked: {
			exports: 'marked'
		},
		app: {
			deps: ['oclazyload','uiRouter','ngCookies','sanizite','httpRequest','message']
		},
		home: {
			deps: ['particle']
		},
		article: {
			deps: ['sanizite','pagination']
		},
		articles: {
			deps: ['carousel', 'pagination']
		},
		user: {
			deps: ['pagination']
		}
	}
});

require(['angular', 'jquery', 'app'], (angular, $, app) => {
	angular.bootstrap($('html'), [app.name]);
});