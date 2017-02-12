define(['angular'], (angular) => {
	let appCtrl = ['$scope', ($scope) => {
		
	}];
	let dependency = [];
	let appModule = angular.module('app', dependency);
	appModule.controller('ctrl', appCtrl);
	appModule.config(($stateProvider, $urlRouterProvider) => {
		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: '../views/home.html',
				controller: 'home.ctrl'
			})
			.state('user', {
				url: '/',
				templateUrl: '../views/home.html',
				controller: 'home.ctrl'
			})
			.state('user.login', {
				url: '/login',
				templateUrl: '../../user/views/login.html',
				controller: 'user.login.ctrl'
			})
			.state('user.register', {
				url: '/register',
				templateUrl: '../views/home.html',
				controller: 'home.ctrl'
			})
	})
	return appModule;
});