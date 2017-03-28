define(['markdown'], function (markdown) {
    var deps = [];
    var createArticleModel = angular.module('createArticle', deps);
    createArticleModel.controller('createArticle.ctrl', ['$rootScope', '$scope', '$cookies', '$state', 'http', function($rootScope, $scope, $cookies, $state, http){
        // markdown({area: 'editormd'})
        // markdown.then(function (res) {
        //     res({area: 'editormd'})
        // })
        $scope.newArticle = {};
        $scope.createArticle = function ($event) {
            if(!$scope.newArticle.title || $scope.newArticle.title.trim() === ''){
                return alert('请输入文章标题');
            }
            if(!$scope.newArticle.content || $scope.newArticle.content.trim() === ''){
                return alert('请输入文章内容');
            }
            if(!$scope.newArticle.tags || $scope.newArticle.tags.trim() === ''){
                return alert('请输入文章标签');
            }
            var editor = $($event.target).parents('.createArticleForm').find('.wangEditor-txt');
            var abstract = editor.text().replace(new RegExp("&nbsp;"), '');
            var len = Math.floor(Math.random() * 71 + 100);
            abstract = abstract.length <= len ? abstract : abstract.slice(0, len) + '...';
        	http.request({
        		method: 'POST',
        		url: '/user/article',
        		data: {
        			token: $cookies.get('TOKEN'),
        			title: $scope.newArticle.title,
        			content: $scope.newArticle.content,
                    abstract: abstract,
        			tags: $scope.newArticle.tags
        		}
        	}).then(function (res) {
        		if(res.data.result){
                    $scope.newArticle.title = '';
                    $scope.newArticle.content = '';
                    editor.html('<p><br></p>');
                    $scope.newArticle.tags = '';
        			$state.go('user', {username: $rootScope.userInfo.username});
        		}
        	});
        };
        $scope.preview = function ($event) {

        };
    }]);
    return createArticleModel;
});