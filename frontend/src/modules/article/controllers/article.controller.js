define([], function () {
	var deps = [];
	var articleModel = angular.module('article', deps);
	articleModel.controller('article.ctrl', ['$rootScope', '$scope', '$stateParams', '$state', '$location', '$cookies', 'http', 'editorService', function($rootScope, $scope, $stateParams, $state, $location, $cookies, http, editorService){
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
							$('.comments').ready(function () {
								var id, replyEditor = [];
								$('.cmtReplyArea > .replyEditor').each(function (i, ele) {
									ele = $(ele);
									id = 'replyEditor_' + i;
									ele.attr('id', id);
									replyEditor.push(editorService.init({element: id, menus: ['emotion']}));
								});
								$scope.reviewReply = function ($event, $index, comment) {
									var editor = replyEditor[$index];
									var replyContent = editor.$txt.html().trim().replace(/^<p><br><\/p>$/, '');
									if(replyContent === ''){
										return alert('请输入回复内容');
									}
									var newReply = {
										articleId: $scope.article._id,
										authorId: $rootScope.userInfo._id,
										content: replyContent,
										replyParent: [comment.author._id],
										reply: [],
									};
									http.request({
										method: 'POST',
										url: '/article/comment',
										data: $.extend(true, {}, {token: $cookies.get('TOKEN'), replyParent: [comment.author._id]}, newReply)
									}).then(function (res) {
										// 回复成功
										if(res.data.result){
											$scope.article.comments += 1;
											$scope.comments.push(res.data.data);
											editor.$txt.html('<p><br></p>');
											alert('回复成功');
										}
									});
								};
								$scope.cancelReply = function ($event, $index) {
									replyEditor[$index].$txt.html('<p><br></p>');
									$($event.target).parent().hide();
								};
							});
						}else{
							console.log('文章评论加载失败');
						}
					});
				}
			});
		}());
		$scope.commentEditor = editorService.init({element: 'commentEditor', menus: ['emotion']});
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
			var commentContent = $scope.commentEditor.$txt.html().trim().replace(/^<p><br><\/p>$/, '');
			if(commentContent === ''){
				return alert('请输入你的评论');
			}
			$scope.newComment = {
				articleId: $scope.article._id,
				authorId: $rootScope.userInfo._id,
				content: commentContent,
				replyParent: [],
				reply: [],
			};
			http.request({
				method: 'POST',
				url: '/article/comment',
				data: $.extend(true, {}, {token: $cookies.get('TOKEN')}, $scope.newComment)
			}).then(function (res) {
				// 评论成功
				if(res.data.result){
					$scope.article.comments += 1;
					$scope.comments.push(res.data.data);
					$scope.commentEditor.$txt.html('<p><br></p>');
					alert('评论成功');
				}
			});
		};
		//子评论(回复)
		// $scope.reviewReply = function ($event, comment) {
		// 	$scope.replyContent = $scope.replyContent.trim();
		// 	//跳转到输入框, 并获取焦点
		// 	if($scope.replyContent === ''){
		// 		return alert('请输入你的评论');
		// 	}
		// 	$scope.newComment = {
		// 		articleId: $scope.article._id,
		// 		authorId: $rootScope.userInfo._id,
		// 		content: $scope.replyContent,
		// 		replyParent: [comment.author.nickname],
		// 		reply: [],
		// 	};
			// http.request({
			// 	method: 'POST',
			// 	url: '/article/comment',
			// 	data: $.extend(true, {}, {token: $cookies.get('TOKEN'), replyParent: [comment.author._id]}, $scope.newComment)
			// }).then(function (res) {
			// 	// 回复成功
			// 	if(res.data.result){
			// 		$scope.article.comments += 1;
			// 		$scope.comments.push(res.data.data);
			// 		if($scope.editor){
			// 			$scope.editor.$txt.html('<p><br></p>');
			// 		}
			// 		alert('回复成功');
			// 	}
			// });
		// };
		// 弹出回复输入框
		$scope.toggleReplay = function ($event) {
			var _this = $($event.target).parent().next('.cmtReplyArea');
			var open = _this.css('display') === 'none' ? true : false;
			$scope.replyContent = '';
			$('.cmtReplyArea').hide();
			$('.cmtReplyArea .wangEditor-txt').html('<p><br></p>');
			if(open){
				if(!$rootScope.userInfo){
					$state.go('home', {login: true, register: false});
					return;
				}
				_this.show();
			}else{
				_this.hide();
			}
		};
		$scope.getReply = function (editor) {
			console.log(editor.$txt.html())
		}
        $(function () {
			// 取消评论
			$scope.cancelReview = function ($event) {
				$scope.commentEditor.$txt.html('<p><br></p>');
			};
			$scope.cancelReply = function (editor) {

			};
			$(document).scroll(function () {
				if($('body').scrollTop() >= $(window).height()){
					$('#goTop').show();
				}else{
					$('#goTop').hide();
				}
			});
			$('#goTop').click(function () {
				$('body').scrollTop(0);
			});
        });
	}]);
	return articleModel;
})