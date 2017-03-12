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
						}else{
							console.log('文章评论加载失败');
						}
					});
					$scope.newComment = {
						articleId: $scope.article._id,
						authorId: $rootScope.userInfo._id,
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
					alert('不能点赞自己的文章');
					return;
				}
				http.request({
					method: 'GET',
					url: '/article/heart?token=' + $cookies.get('TOKEN') + '&articleId=' + $scope.article._id
				}).then(function (res) {
					if(res.data.result){
						alert('点赞成功');
						$scope.article.heart = res.data.data.heart;
						$scope.article.stamp = res.data.data.stamp;
					}else{
						alert(res.data.msg);
					}
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
					alert('不能反对自己的文章');
					return;
				}
				http.request({
					method: 'GET',
					url: '/article/stamp?token=' + $cookies.get('TOKEN') + '&articleId=' + $scope.article._id
				}).then(function (res) {
					if(res.data.result){
						alert('反对成功');
						$scope.article.heart = res.data.data.heart;
						$scope.article.stamp = res.data.data.stamp;
					}else{
						alert(res.data.msg);
					}
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
				// 评论成功
				if(res.data.result){
					$scope.article.comments += 1;
					$scope.comments.push(res.data.data);
					if($scope.editor){
						$scope.editor.$txt.html('<p><br></p>');
					}
					alert('评论成功');
				}
			});
		};
		//子评论(回复)
		$scope.reviewReply = function (comment) {
			//跳转到输入框, 并获取焦点
			$('body').scrollTop($('.commentsTextArea').offset().top - ($(window).height() - 160) / 2);
			if($scope.newComment.content === ''){
				return alert('请输入你的评论');
			}
			http.request({
				method: 'POST',
				url: '/article/comment',
				data: $.extend(true, {}, {token: $cookies.get('TOKEN'), replyParent: [comment.author._id]}, $scope.newComment)
			}).then(function (res) {
				// 回复成功
				if(res.data.result){
					$scope.article.comments += 1;
					$scope.comments.push(res.data.data);
					if($scope.editor){
						$scope.editor.$txt.html('<p><br></p>');
					}
					alert('回复成功');
				}
			});
		};
		// 弹出回复输入框
		$scope.toggleReplay = function ($event) {
			$($event.target).parent().next('.cmtReplyArea').toggle();
		};
		// 取消回复
		$scope.cancelReply = function () {
			
		};
        $(function () {
			// 取消评论
			$scope.cancelReview = function () {
				$scope.editor.$txt.html('<p><br></p>');
			};
        })
	}]);
	return articleModel;
})