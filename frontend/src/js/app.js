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
						})
						.state('user', {
							url: '/:username',
							templateUrl: 'src/views/user.html',
							controller: 'user.ctrl'
						})
						.state('404', {
							url: '/404',
							templateUrl: 'src/views/404.html'
						})
						.state('500', {
							url: '/500',
							templateUrl: 'src/views/500.html'
						});
				})
				.config(function ($httpProvider) {
					$httpProvider.interceptors.push('tokenInterceptor');
				});