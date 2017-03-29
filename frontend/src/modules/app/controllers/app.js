define([], function () {
	var deps = ['oc.lazyLoad', 'ui.router', 'ngCookies', 'ngSanitize', 'httpRequest'];
	var app = angular.module('app', deps);
    app.run(['$rootScope', function ($rootScope) {
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.prevState = fromState;
            $rootScope.prevParams = fromParams;
        });
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            // 跳转到登陆页面，并记录页面的状态
            if(toState.name === 'home'){
                $rootScope.prevScrollTop = $('body').scrollTop();
            }
        });
    }]);
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
                        return $ocLazyLoad.load('articles');
                    }]
                }
            })
            .state('user', {
            	url: '/{username: [a-z]{1}[a-z0-9]{0,5}}',
            	templateUrl: 'src/modules/user/tpls/user.html',
				controller: 'user.ctrl',
				resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('user');
                    }]
                }
            })
            .state('article', {
            	url: '/{username: [a-z]{1}[a-z0-9]{0,5}}/a/{articleId}',
            	templateUrl: 'src/modules/article/tpls/article.html',
				controller: 'article.ctrl',
				resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('article');
                    }]
                }
            })
            .state('createArticle', {
				url: '/createArticle',
				templateUrl: 'src/modules/createArticle/tpls/createArticle.html',
				controller: 'createArticle.ctrl',
				resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('createArticle');
                    }]
                }
			})
			.state('updateArticle', {
				url: '/{username: [a-z]{1}[a-z0-9]{0,5}}/{articleId}/update',
				templateUrl: 'src/modules/updateArticle/tpls/updateArticle.html',
				controller: 'updateArticle.ctrl',
				resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('updateArticle');
                    }]
                }
			})
            .state('settings', {
                url: '/{username: [a-z]{1}[a-z0-9]{0,5}}/settings',
                templateUrl: 'src/modules/user/tpls/settings.html',
                controller: 'settings.ctrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('settings');
                    }],
                    checkLogin: ['$rootScope', '$state', function ($rootScope, $state) {
                        if(!$rootScope.userInfo){
                            $state.go('home', {home:{login: true, register: false}});
                            return;
                        }else{
                            return true;
                        }
                    }]
                }
            })
            .state('findPwd', {
                url: '/findPwd',
                templateUrl: 'src/modules/user/tpls/findPwd.html',
                controller: 'findPwd.ctrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('findPwd');
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
        // 显示或者隐藏回到顶部
        $(document).scroll(function () {
            if($('body').scrollTop() >= $(window).height()){
                $('#goTop').show();
            }else{
                $('#goTop').hide();
            }
        });
        $('#goTop').click(function (e) {
            $('body').animate({
                scrollTop: 0
            }, 500);
            $('#goTop').animate({
                bottom: '400px',
                opacity: 0
            }, 500, function () {
                $('#goTop').css({
                    bottom: 0,
                    opacity: 1
                });
            });
        });
    }]);
    return app;
})