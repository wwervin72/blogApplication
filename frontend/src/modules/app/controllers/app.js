define(['angular', 'uiRouter', './homeController', '../../user/controllers/loginController', '../../user/controllers/registerController'], (angular, uiRouter, home, login, register) => {
	let appCtrl = ['$rootScope', '$scope', '$cookies', '$state', ($rootScope, $scope, $cookies, $state) => {
		// 获取token后，获取用户的信息
		$scope.getUserInfo = function () {
			let token = $cookies.get('TOKEN');
			if(!token || $rootScope.user){
				return;
			}
			$.ajax({
				type: 'GET',
				url: 'http://localhost:3000/userinfo?token='+token
			}).then(function (res) {
				$scope.$apply(function () {
					$rootScope.user = res.data.username;
				});
			}, function (res) {
				console.log(res)
			});
		};
		$scope.getUserInfo();
		//登出
		$scope.loginOut = function () {
    		$.ajax({
    			type: 'GET',
    			url: 'http://localhost:3000/signout?token=' + $cookies.get('TOKEN')
    		}).then(function (res) {
    			if(res.result){
    				$cookies.remove("TOKEN", {path: '/'});
    				$state.go('login');
    				delete $rootScope.user;
    			}
    		}, function (res) {
    			console.log(res)
    		})
    	};
	}];

	let dependency = ['ui.router', home.name, login.name, register.name];
	let appModule = angular.module('app', dependency);
	appModule.controller('ctrl', appCtrl);
	appModule.config(function ($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise("/");
		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: 'src/modules/app/views/home.html',
				controller: 'home.ctrl'
			})
			.state('login', {
				url: '/login',
				templateUrl: 'src/modules/user/views/login.html',
				controller: 'login.ctrl'
			})
			.state('register', {
				url: '/register',
				templateUrl: 'src/modules/user/views/register.html',
				controller: 'register.ctrl'
			});
	});
	return appModule;
});