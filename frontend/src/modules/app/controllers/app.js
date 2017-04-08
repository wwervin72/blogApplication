define([], function () {
	var deps = ['oc.lazyLoad','ui.router','ngCookies','ngSanitize','httpRequest','message'];
	var app = angular.module('app', deps);
    app.run(['$rootScope','$state', function ($rootScope,$state) {
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.prevState = fromState;
            $rootScope.prevParams = fromParams;
            var needLogin = ['createArticle'];
            if(!$rootScope.userInfo && needLogin.indexOf(toState.name) !== -1){
                $state.go('home', {home: {login: true, register: false}});
            }
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
            	url: '/u/{username: [a-zA-Z0-9]{5,16}}',
            	templateUrl: 'src/modules/user/tpls/user.html',
				controller: 'user.ctrl',
				resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('user');
                    }]
                }
            })
            .state('article', {
            	url: '/u/{username: [a-zA-Z0-9]{5,16}}/a/{articleId}',
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
				url: '/u/{username: [a-zA-Z0-9]{5,16}}/{articleId}/update',
				templateUrl: 'src/modules/updateArticle/tpls/updateArticle.html',
				controller: 'updateArticle.ctrl',
				resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('updateArticle');
                    }]
                }
			})
            .state('settings', {
                url: '/u/{username: [a-zA-Z0-9]{5,16}}/settings',
                templateUrl: 'src/modules/user/tpls/settings.html',
                controller: 'settings.ctrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('settings');
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
    app.controller('app.ctrl', ['$rootScope','$scope','$cookies','http','message-service', function($rootScope,$scope,$cookies,http,message){
        // 获取用户的信息
        (function () {
            var token = $cookies.get('TOKEN');
            if(token && !$rootScope.userInfo){
                http.request({
                    method: 'GET',
                    url: '/userinfo?token=' + token
                }).then(function (res) {
                    if(res.data.result){
                        $rootScope.userInfo = res.data.info;
                    }else{
                        message({type: 'error', text: '用户信息获取失败'});
                    }
                });
            }
        }());
        $('#header .avatar, #header .avatar .userList').hover(function () {
            $(this).find('.userList').show();
        }, function () {
            $(this).find('.userList').hide();
        });
        // 退出登陆
        $scope.loginOut = function () {
            http.request({
                method: 'GET',
                url: '/logout?token=' + $cookies.get('TOKEN')
            }).then(function (res) {
                if(res.data.result){
                    message({type: 'success', text: '你已退出登陆'});
                    $cookies.remove("TOKEN", {path: '/'});
                    delete $rootScope.userInfo;
                }
            })
        };
        // 显示或者隐藏回到顶部
        $(document).unbind('scroll');
        $(document).scroll(function () {
            if($('body').scrollTop() >= $(window).height()){
                $('#goTop').show();
            }else{
                $('#goTop').hide();
            }
        });
        // 回到顶部
        $('#goTop').unbind('click');
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
        $rootScope.emojiArr = {
            first: [
                [
                    'blush.png',
                    'relaxed.png',
                    'kissing_heart.png',
                    'flushed.png',
                    'grin.png',
                    'heart_eyes.png',
                    'kissing_closed_eyes.png',
                    'smile.png',
                    'smiley.png',
                    'wink.png'
                ],
                [
                    'stuck_out_tongue_winking_eye.png',
                    'stuck_out_tongue_closed_eyes.png',
                    'unamused.png',
                    'smirk.png',
                    'sweat.png',
                    'pensive.png',
                    'confounded.png',
                    'disappointed_relieved.png',
                    'cold_sweat.png',
                    'fearful.png'
                ],
                [
                    'persevere.png',
                    'cry.png',
                    'sob.png',
                    'joy.png',
                    'scream.png',
                    'angry.png',
                    'sleepy.png',
                    'mask.png',
                    'innocent.png',
                    'yum.png'
                ],
                [
                    'anguished.png',
                    'frowning.png',
                    'hushed.png',
                    'dizzy_face.png',
                    'stuck_out_tongue.png',
                    'no_mouth.png',
                    'sunglasses.png',
                    'sweat_smile.png',
                    'worried.png',
                    '+1.png'
                ],
                [
                    '-1.png',
                    'clap.png',
                    'v.png',
                    'pray.png',
                    'fist.png',
                    'heart.png',
                    'broken_heart.png',
                    'heartbeat.png',
                    'sparkling_heart.png',
                    'cupid.png'
                ],
            ],
            second: [
                [
                    'dog.png',
                    'cow.png',
                    'cat.png',
                    'bear.png',
                    'sunny.png',
                    'birthday.png',
                    'beers.png',
                    'beer.png',
                    'baby_chick.png',
                    'frog.png'
                ],
                [
                    'apple.png',
                    'angel.png',
                    'turtle.png',
                    'tiger.png',
                    'rabbit.png',
                    'snowflake.png',
                    'cloud.png',
                    'zap.png',
                    'first_quarter_moon_with_face.png',
                    'high_brightness.png'
                ],
                [
                    'heavy_exclamation_mark.png',
                    'interrobang.png',
                    'bangbang.png',
                    'underage.png',
                    'no_bicycles.png',
                    'no_mobile_phones.png',
                    'ambulance.png',
                    'arrows_counterclockwise.png',
                    'smirk_cat.png',
                    'smiley_cat.png'
                ],
                [
                    'smile_cat.png',
                    'scream_cat.png',
                    'heart_eyes_cat.png',
                    'crying_cat_face.png',
                    'octocat.png',
                    'eyes.png',
                    'watermelon.png',
                    'hankey.png',
                ]
            ]
        };
    }]);
    return app;
})