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