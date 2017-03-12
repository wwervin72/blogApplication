define([], function () {
	var deps = [];
	var articleModel = angular.module('article', deps);
	articleModel.controller('article.ctrl', ['$rootScope', '$scope', '$stateParams', '$state', '$location', '$cookies', 'http', function($rootScope, $scope, $stateParams, $state, $location, $cookies, http){
		// 获取文章信息
		(function () {
			http.request({
				url: '/article?username=' + $stateParams.username + '&articleId=' + $stateParams.articleId,
				method: 'GET',
			}).then(function(res) {
				if(res.data.result){
					$scope.article = res.data.data;
					//获取文章的内容之后， 获取文章的评论
					http.request({
						method: 'GET',
						url: '/comments?token=' + $cookies.get('TOKEN') + '&articleId=' + $scope.article._id
					}).then(function (response) {
						if(response.data.result){
							$scope.comments = response.data.data;
							console.log($scope.comments)
						}else{
							console.log('文章评论加载失败');
						}
					});
					$scope.newComment = {
						articleId: $scope.article._id,
						authorId: $scope.article.author._id,
						content: '',
						replyParent: [],
						reply: [],
					};
				}
			});
		}());
		// 点赞文章
		$scope.heart = function () {
			if(!$rootScope.userInfo){
				sessionStorage.redirectTo = $location.path();
				$state.go('home', {home:{login: true, register: false}});
			}else{
				//推荐
				if($rootScope.userInfo._id === $scope.article.author._id){
					console.log('不能点赞自己的文章');
					return;
				}
				http.request({
					method: 'GET',
					url: '/article/heart?token=' + $cookies.get('TOKEN') + '&articleId=' + $scope.article._id
				}).then(function (res) {
					console.log(res)
				});
			}
		};
		// 反对文章
		$scope.stamp = function () {
			if(!$rootScope.userInfo){
				sessionStorage.redirectTo = $location.path();
				$state.go('home', {home:{login: true, register: false}});
			}else{
				// 反对
				if($rootScope.userInfo._id === $scope.article.author._id){
					console.log('不能反对自己的文章');
					return;
				}
				http.request({
					method: 'GET',
					url: '/article/stamp?token=' + $cookies.get('TOKEN') + '&articleId=' + $scope.article._id
				}).then(function (res) {
					console.log(res)
				});
			}
		};
		// 评论文章(根评论)
		$scope.reviewArticle = function () {
			if($scope.newComment.content === ''){
				return alert('请输入你的评论');
			}
			http.request({
				method: 'POST',
				url: '/article/comment',
				data: $.extend(true, {}, {token: $cookies.get('TOKEN')}, $scope.newComment)
			}).then(function (res) {
				console.log(res)
				// 评论成功
				if(res.result){
					// $scope.article
				}
			});
		};
		//子评论(回复)
		$scope.reviewReply = function (comment) {
			http.request({
				method: 'POST',
				url: '/article/comment',
				data: $scope.newComment
			}).then(function (res) {
				console.log(res)
				// 回复成功
				if(res.result){

				}
			});
		}
	}]);
	return articleModel;
})