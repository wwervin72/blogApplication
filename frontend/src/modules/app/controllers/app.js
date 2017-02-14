define(['angular', 'uiRouter', './homeController', '../../user/controllers/loginController', '../../user/controllers/registerController'], (angular, uiRouter, home, login, register) => {
	let appCtrl = ['$scope', ($scope) => {
		
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