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
		// 评论文章
		$scope.reviewArticle = function ($event) {
			var commentContent = $($event.target).parents('.commentsHandle').prev('textarea').val();
			if(commentContent === ''){
				return alert('请输入你的评论');
			}
			var reg = /:(\w+):/ig;
			commentContent = commentContent.replace(reg, '<img src="src/static/img/emojis/$1.png" title="$1">');
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
					$scope.comments[$scope.comments.length] = res.data.data;
					$($event.target).parents('.commentsHandle').prev('textarea').val('');
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
			$($event.target).parents('.cmtReplyArea').find('textarea').val('');
			$($event.target).parents('.cmtReplyArea').hide();
		};
		// 取消更新评论
		$scope.cancelUpdateComment = function ($event) {
			$($event.target).parents('.updateReplyArea').hide();
		};
		// 取消评论
		$scope.cancelReview = function ($event) {
			$($event.target).parents('.commentsEditor').find('textarea').val('');
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
						authorId: comment.author._id,
						articleId: comment.article
					}
				}).then(function (res) {
					if(res.data.result){
						alert('删除成功');
						$scope.comments.splice($index, 1);
						$scope.article.comments -= 1;
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
		// 弹出回复输入框
		$scope.toggleReplay = function ($event) {
			if(!$rootScope.userInfo){
				$state.go('home', {home:{login: true, register: false}});
				return;
			}
			var target = $($event.target).parent().siblings('.cmtReplyArea');
			if(target.css('display') === 'none'){
				$('.cmtReplyArea').hide();
				$('.updateReplyArea').hide();
				target.show();
			}else{
				target.hide();
			}
		};
		// 弹出修改评论菜单
		$scope.updateCommentToggle = function ($event, $index) {
			var reg = /<img\s*src="src\/static\/img\/emojis\/(\w+).png"\s*title="(\w+)">/ig;
			var target = $($event.target).parent().siblings('.updateReplyArea');
			var textarea = target.find('textarea');
			if(target.css('display') === 'none'){
				$('.cmtReplyArea').hide();
				$('.updateReplyArea').hide();
				target.show();
			}else{
				target.hide();
			}
			textarea.val($scope.comments[$index].content.replace(reg, ':$1: '));
		};
		// 修改评论
		$scope.updateComment = function ($event, $index) {
			var commentContent = $($event.target).parents('.commentsHandle').prev('textarea').val();
			if(commentContent === ''){
				return alert('请输入你的评论');
			}
			var reg = /:(\w+):/ig;
			commentContent = commentContent.replace(reg, '<img src="src/static/img/emojis/$1.png" title="$1">');
			http.request({
				method: 'put',
				url: '/article/comment',
				data: {
					token: $cookies.get('TOKEN'),
					commentId: $scope.comments[$index]._id,
					newComment: commentContent,
				}
			}).then(function (res) {
				if(res.data.result){
					$scope.comments[$index].content = commentContent;
					$($event.target).parents('.updateReplyArea').hide();
					alert('修改成功');
				}else{
					alert('修改失败');
				}
			})
		};
		// 表情选择框开关
		$scope.showemoji = function ($event) {
			var target = $($event.target);
			target.next('.emoji-list').toggle();
		};
		// ctrl enter评论事件
		$(document).keydown(function (e) {
			var event = e || window.event;
			var textarea = $('textarea:focus');
			if(textarea.length && event.ctrlKey && event.keyCode === 13){
				var btn = textarea.find('+.commentsHandle .handle-right button');
				btn.click();
			}
		});
		// 点击body中其他地方关闭表情选择框
		$('body').click(function (e) {
			var event = e || window.event;
			var target = event.target || event.srcElement;
			if(!$(target).parents('.emoji').length){
				$('.emoji-list').hide();
			}
		});
		// 选择表情
		$('body').on('.emoji-img li', 'click', function (e) {
			var event = e || window.event;
			var target = $(event.target || event.srcElement);
			if(target[0].nodeName === 'LI'){
				target = target.find('img');
			}
			var textarea = target.parents('.commentsHandle').prev();
			textarea.val(textarea.val() + ':'+target.attr('title')+': ');
			target.parents('.emoji-list').hide(); 
		});
		$('.articleContent').on('.emoji-class-list > span', 'click', function (e) {
			var event = e || window.event;
			var target = $(event.target || event.srcElement);
			$('.emoji-class-list > span').removeClass('active');
			target.parent().find('+.emoji-img-content>div').removeClass('active');
			target.addClass('active');
			target.parent().find('+.emoji-img-content>div').eq(target.index()).addClass('active');

		})
	}]);
	return articleModel;
})