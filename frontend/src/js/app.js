const app = angular.module('app', ['ui.router', 'ngCookies'])
				.config(function ($locationProvider, $stateProvider, $urlRouterProvider){
					$urlRouterProvider.otherwise("/");
					$stateProvider
						// 主页 所有的文章
						.state('home', {
							url: '/',
							templateUrl: 'src/views/home.html',
							controller: 'home.ctrl'
						})
						.state('article', {
							url: '/a',
							templateUrl: 'src/views/article.html',
							controller: 'article.ctrl'
						})
						// 注册
						.state('register', {
							url: '/register',
							templateUrl: 'src/views/register.html',
							controller: 'register.ctrl'
						})
						// 某个user所有的文章post
						.state('user', {
							url: '/{username: [a-z]{1}[a-z0-9]{0,5}}',
							templateUrl: 'src/views/user.html',
							controller: 'user.ctrl'
						})
						// 某一篇文章
						.state('userPost', {
							url: '/{username: [a-z]{1}[a-z0-9]{0,5}}/articles/{postId}',
							templateUrl: 'src/views/post.html',
							controller: 'post.ctrl'
						})
						// user新建文章
						.state('createPost', {
							url: '/{username: [a-z]{1}[a-z0-9]{0,5}}/createPost',
							templateUrl: 'src/views/createPost.html',
							controller: 'createPost.ctrl'
						})
						.state('updatePost', {
							url: '/{username: [a-z]{1}[a-z0-9]{0,5}}/articles/{postId}/update',
							template: 'src/views/updatePost.html',
							controller: 'updatePost.ctrl'
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
				.config(['$httpProvider', function ($httpProvider) {
					$httpProvider.interceptors.push('tokenInterceptor');
				}]);