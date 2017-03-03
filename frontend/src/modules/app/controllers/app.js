define([], function () {
	var deps = ['oc.lazyLoad', 'ui.router', 'ngCookies', 'httpRequest', 'editor'];
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
                params: {home: null},
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('home');
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
            	url: '/{username: [a-z]{1}[a-z0-9]{0,5}}/a',
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
            .state('createArticle', {
				url: '/createArticle',
				templateUrl: 'src/modules/createArticle/tpls/createArticle.html',
				controller: 'createArticle.ctrl',
				resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('createArticle')
                    }]
                }
			})
			.state('updateArticle', {
				url: '/{username: [a-z]{1}[a-z0-9]{0,5}}/{ArticleId}/update',
				template: 'src/modules/updateArticle/updateArticle.html',
				controller: 'updateArticle.ctrl',
				resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('updateArticle')
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
    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('tokenInterceptor');
    }]);
    app.controller('app.ctrl', ['$rootScope', '$scope', '$cookies', 'http', function($rootScope, $scope, $cookies, http){
        $('#header .avatar, #header .avatar .userList').hover(function () {
            $(this).find('.userList').show();
        }, function () {
            $(this).find('.userList').hide();
        });
        $scope.loginOut = function () {
            http.request({
                method: 'GET',
                url: '/logout?token=' + $cookies.get('TOKEN')
            }).then(function (res) {
                if(res.data.result){
                    $cookies.remove("TOKEN", {path: '/'});
                    delete $rootScope.userInfo;
                }
            })
        };
        $rootScope.parseTime = function (date) {
            date = new Date(date);
            let month = date.getMonth() + 1;
            month = month < 10 ? ('0' + month) : month;
            let day = date.getDate();
            day = day < 10 ? ('0' + day) : day;
            let hours = date.getHours();
            hours = hours < 10 ? ('0' + hours) : hours;
            let minutes = date.getMinutes();
            minutes = minutes < 10 ? ('0' + minutes) : minutes;
            let seconds = date.getSeconds();
            seconds = seconds < 10 ? ('0' + seconds) : seconds;
            return date.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        };
    }]);
    return app;
})