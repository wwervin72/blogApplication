const app = angular.module('app', ['ui.router', 'ngCookies'])
				.config(function ($stateProvider, $urlRouterProvider){
					$urlRouterProvider.otherwise("/");
					$stateProvider
						.state('home', {
							url: '/',
							templateUrl: 'src/views/home.html',
							controller: 'home.ctrl'
						})
						.state('register', {
							url: '/register',
							templateUrl: 'src/views/register.html',
							controller: 'register.ctrl'
						});
				});