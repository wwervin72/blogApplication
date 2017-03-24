define([], function () {
	var deps = [];
	var articleModel = angular.module('article', deps);
	articleModel.controller('article.ctrl', ['$rootScope', '$scope', '$stateParams', '$state', '$location', '$cookies', 'http', function($rootScope, $scope, $stateParams, $state, $location, $cookies, http){
		$scope.editorMenus = ['emotion'];
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
				}
			});
		}());
		// 点赞文章
		$scope.heartArticle = function () {
			if(!$rootScope.userInfo){
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
		$scope.stampArticle = function () {
			if(!$rootScope.userInfo){
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
		$scope.reviewArticle = function ($event) {
			var editor = $($event.target).parent().find('.wangEditor-txt');
			var commentContent = editor.html().trim().replace(/^<p><br><\/p>$/, '');
			if(commentContent === ''){
				return alert('请输入你的评论');
			}
			var newComment = {
				articleId: $scope.article._id,
				authorId: $rootScope.userInfo._id,
				content: commentContent,
				authorNickname: $rootScope.userInfo.nickname,
				replyParent: [],
				reply: [],
			};
			http.request({
				method: 'POST',
				url: '/article/comment',
				data: $.extend(true, {}, {token: $cookies.get('TOKEN')}, newComment)
			}).then(function (res) {
				// 评论成功
				if(res.data.result){
					$scope.article.comments += 1;
					$scope.comments.push(res.data.data);
					editor.html('<p><br></p>');
					alert('评论成功');
				}
			});
		};
		// 删除文章
		$scope.deleteArticle = function () {
			var val = confirm('确认删除?');
			if(val){
				http.request({
					method: 'DELETE',
					url: '/user/article',
					data: {
						token: $cookies.get('TOKEN'),
						articleId: $scope.article._id,
						authorId: $scope.article.author._id
					}
				}).then(function (res) {	
					if(res.data.result){
						alert('删除成功');
						$state.go('articles');
					}else{
						alert('删除失败');
					}
				})
			}
		};
		//子评论(回复)
		$scope.reviewReply = function ($event, comment) {
			var editor = $($event.target).parent().find('.wangEditor-txt');
			var replyContent = editor.html().trim().replace(/^<p><br><\/p>$/, '');
			if(replyContent === ''){
				return alert('请输入回复内容');
			}
			var newReply = {
				articleId: $scope.article._id,
				authorId: $rootScope.userInfo._id,
				content: replyContent,
				authorNickname: $rootScope.userInfo.nickname,
				replyParent: [comment._id],
				reply: [],
			};
			http.request({
				method: 'POST',
				url: '/article/comment',
				data: $.extend(true, {}, {token: $cookies.get('TOKEN')}, newReply)
			}).then(function (res) {
				// 回复成功
				if(res.data.result){
					$scope.article.comments += 1;
					$scope.comments.push(res.data.data);
					editor.html('<p><br></p>');
					alert('回复成功');
				}
			});
		};
		// 取消回复
		$scope.cancelReply = function ($event, $index) {
			$($event.target).parent().find('.wangEditor-txt').html('<p><br></p>');
			$($event.target).parent().hide();
		};
		// 取消评论
		$scope.cancelReview = function ($event) {
			$($event.target).parent().find('.wangEditor-txt').html('<p><br></p>');
		};
		// 弹出回复输入框
		$scope.toggleReplay = function ($event) {
			var _this = $($event.target).parent().next('.cmtReplyArea');
			var open = _this.css('display') === 'none' ? true : false;
			$('.cmtReplyArea').hide();
			$('.cmtReplyArea .wangEditor-txt').html('<p><br></p>');
			if(open){
				if(!$rootScope.userInfo){
					$state.go('home', {login: true, register: false});
					return;
				}
				_this.siblings('.updateReplyArea').hide();
				_this.show();
			}else{
				_this.hide();
			}
		};
		// 删除评论
		$scope.deleteComment = function (comment, $index){
			var val = confirm('确认删除?');
			if(val){
				http.request({
					method: 'DELETE',
					url: '/article/comment',
					data: {
						token: $cookies.get('TOKEN'),
						commentId: comment._id,
						authorId: comment.author._id
					}
				}).then(function (res) {
					if(res.data.result){
						alert('删除成功');
						$scope.comments.splice($index, 1);
					}else{
						alert('删除失败');
					}
				});
			}
		};
		// 点赞评论
		$scope.heartComment = function (comment,$index) {
			if(!$rootScope.userInfo){
				$state.go('home', {home:{login: true, register: false}});
			}else{
				if($rootScope.userInfo._id === comment.author._id){
					alert('不能点赞自己的评论');
					return;
				}
				http.request({
					method: 'GET',
					url: '/comment/heart?token='+$cookies.get('TOKEN')+'&commentId='+comment._id+'&authorId='+comment.author._id
				}).then(function (res) {
					if(res.data.result){
						$scope.comments[$index].heart = res.data.data.heart;
						$scope.comments[$index].stamp = res.data.data.stamp;
						alert('点赞成功');
					}else{
						alert('点赞失败');
					}
				});
			}
		};
		// 反对评论
		$scope.stampComment = function (comment,$index) {
			if(!$rootScope.userInfo){
				$state.go('home', {home:{login: true, register: false}});
			}else{
				if($rootScope.userInfo._id === comment.author._id){
					alert('不能反对自己的评论');
					return;
				}
				http.request({
					method: 'GET',
					url: '/comment/stamp?token='+$cookies.get('TOKEN')+'&commentId='+comment._id+'&authorId='+comment.author._id
				}).then(function (res) {
					if(res.data.result){
						$scope.comments[$index].heart = res.data.data.heart;
						$scope.comments[$index].stamp = res.data.data.stamp;
						alert('反对成功');
					}else{
						alert('反对失败');
					}
				});
			}
		};
		// 弹出修改评论菜单
		$scope.updateCommentToggle = function ($event, $index) {
			var editorP = $($event.target).parent().siblings('.cmtReplyArea');
			var updateEditorP = editorP.siblings('.updateReplyArea');
			var updateEditor = updateEditorP.find('.wangEditor-txt');
			var toggle = updateEditorP.css('display') === 'none' ? true : false;
			if(updateEditor.html().trim().replace(/^<p><br><\/p>$/, '') === ''){
				updateEditor.html($scope.comments[$index].content);
			}
			if(toggle){
				$('.updateReplyArea').hide();
				editorP.hide();
				updateEditorP.show();
			}else{
				updateEditorP.hide();
			}
		};
		// 修改评论
		$scope.updateComment = function ($event, $index) {
			var editor = $($event.target).parent().find('.wangEditor-txt');
			var newComment = editor.html().trim().replace(/^<p><br><\/p>$/, '');
			if(newComment === ''){
				return alert('请输入评论内容');
			}
			http.request({
				method: 'put',
				url: '/article/comment',
				data: {
					token: $cookies.get('TOKEN'),
					commentId: $scope.comments[$index]._id,
					newComment: newComment,
				}
			}).then(function (res) {
				if(res.data.result){
					$scope.comments[$index].content = newComment;
					$($event.target).parent().hide();
					alert('修改成功');
				}else{
					alert('修改失败');
				}
			})
		};
		// 取消更新评论
		$scope.cancelUpdateComment = function ($event) {
			$($event.target).parent().hide();
		};
		// $scope.showFace = 
		$('.face-icon').click(function (e) {
			var event = e || window.event;
			var target = event.target || event.srcElement;
			target = $(target);
			target.next('.face-list').toggle();
		});
		$(document).scroll(function () {
			if($('body').scrollTop() >= $(window).height()){
				$('#goTop').show();
			}else{
				$('#goTop').hide();
			}
		});
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
	}]);
	return articleModel;
})