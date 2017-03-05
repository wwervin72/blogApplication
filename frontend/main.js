requirejs.config({
	baseUrl: './',
	paths: {
		angular: 'libs/angular/angular.min',
		jquery: 'libs/jquery/dist/jquery.min',
		bootstrap: 'libs/bootstrap/dist/js/bootstrap.min',
		uiRouter: 'libs/angular-ui-router/release/angular-ui-router.min',
		ngCookies: 'libs/angular-cookies/angular-cookies.min',
		oclazyload: 'libs/oclazyload/dist/ocLazyLoad.require.min',
		sanizite: 'libs/angular-sanitize/angular-sanitize.min',
		wangEditor: 'libs/wangEditor/src/js/wangEditor',
		httpRequest: 'src/services/httpService',
		particle: 'src/services/particleService',
		editor: 'src/directives/editorDirective',
		app: 'src/modules/app/controllers/app',
		home: 'src/modules/home/controllers/home.controller',
		articles: 'src/modules/articles/controllers/articles.controller',
		user: 'src/modules/user/controllers/user.controller',
		article: 'src/modules/article/controllers/article.controller',
		createArticle: 'src/modules/createArticle/controllers/createArticle.controller',
		updateArticle: 'src/modules/updateArticle/controllers/updateArticle.controller'
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
		httpRequest: {
			deps: ['angular']
		},
		particle: {
			exports: 'particle'
		},
		app: {
			deps: ['oclazyload', 'uiRouter', 'ngCookies', 'sanizite', 'httpRequest', 'editor']
		},
		home: {
			deps: ['particle']
		},
		editor: {
			deps: ['wangEditor']
		},
		article: {
			deps: ['sanizite']
		}
	}
});

require(['angular', 'jquery', 'app'], (angular, $, app) => {
	var injector = angular.bootstrap($('html'), [app.name]);
	var cookies = angular.injector(['ngCookies']).get('$cookies');
	var http = angular.injector(['ng', 'httpRequest']).get('http');
	var location = injector.get('$location');
	(function () {
        if(!cookies.get('TOKEN')){
            return;
        }
        http.request({
            method: 'GET',
            url: '/userinfo?token=' + cookies.get('TOKEN')
        }).then(function (res) {
	        var rootScope = injector.get("$rootScope");
            if(res.data.result){
                rootScope.userInfo = res.data.user;
            }
            cookies.remove("TOKEN", {path: '/'});
            var timeCount = new Date().getTime() + 1000 * 60 * 30;
            var deadline = new Date(timeCount);
            cookies.put('TOKEN', res.data.token, {'expires': deadline, path: '/'});
        }, function (res) {
        	if(res.status === 404){
                location.path('/404');
            }
            if(res.status === 500){
                location.path('/500');
            }
        });
    }());
});