define([], function () {
	var deps = ['oc.lazyLoad', 'ui.router'];
	var app = angular.module('app', deps);
	app.config(['$ocLazyLoadProvider', '$stateProvider', '$urlRouterProvider', function ($ocLazyLoadProvider, $stateProvider, $urlRouterProvider) {
        $ocLazyLoadProvider.config({
            jsLoader: requirejs,
            debug: false
        });
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'src/modules/home/tpls/home.html',
                controller: 'home.ctrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('home')
                    }]
                }
            })
            .state('articles', {
            	url: '/a',
            	templateUrl: 'src/modules/articles/tpls/articles.html',
                controller: 'articles.ctrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('articles')
                    }]
                }
            })
            .state('user', {
            	url: '/{username: [a-z]{1}[a-z0-9]{0,5}}',
            	templateUrl: 'src/modules/user/tpls/user.html',
				controller: 'user.ctrl',
				resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('user')
                    }]
                }
            })
            .state('article', {
            	url: '/{username: [a-z]{1}[a-z0-9]{0,5}}/a/{postId}',
            	templateUrl: 'src/modules/article/tpls/article.html',
				controller: 'article.ctrl',
				resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('article')
                    }]
                }
            })
            .state('createPost', {
				url: '/{username: [a-z]{1}[a-z0-9]{0,5}}/createPost',
				templateUrl: 'src/modules/createPost/tpls/createPost.html',
				controller: 'createPost.ctrl',
				resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('createPost')
                    }]
                }
			})
			.state('updatePost', {
				url: '/{username: [a-z]{1}[a-z0-9]{0,5}}/articles/{postId}/update',
				template: 'src/modules/updatePost/updatePost.html',
				controller: 'updatePost.ctrl',
				resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('updatePost')
                    }]
                }
			})
			.state('404', {
				url: '/404',
				templateUrl: 'src/modules/404/tpls/404.html'
			})
			.state('500', {
				url: '/500',
				templateUrl: 'src/modules/500/tpls/500.html'
			});
        $urlRouterProvider.otherwise("/a");
    }]);
})