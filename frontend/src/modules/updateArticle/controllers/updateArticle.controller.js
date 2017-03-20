define([], function () {
    var deps = [];
    var updateArticleModel = angular.module('updateArticle', deps);
    updateArticleModel.controller('updateArticle.ctrl', ['$rootScope', '$scope', '$stateParams', '$cookies', '$state', 'http', function($rootScope, $scope, $stateParams, $cookies, $state, http){
        $scope.getArticle = function () {
            var editor = $('.wangEditor-txt');
        	http.request({
        		method: 'GET',
        		url: '/article?username='+$stateParams.username+'&articleId='+$stateParams.articleId
        	}).then(function (res) {
        		$scope.article = res.data.data;
                $scope.article.tags = $scope.article.tags.join(',');
                editor.html($scope.article.content);
        	})
        };
        $scope.updateArticle = function () {
            if(!$rootScope.userInfo){
                $state.go('home', {home:{login: true, register: false}});
                return;
            }
            if(!$scope.article.title || $scope.article.title.trim() === ''){
                return alert('请输入文章标题');
            }
            if(!$scope.article.content || $scope.article.content.trim() === ''){
                return alert('请输入文章内容');
            }
            if(!$scope.article.tags || $scope.article.tags.trim() === ''){
                return alert('请输入文章标签');
            }
            http.request({
                method: 'PUT',
                url: '/user/article',
                data: {
                    token: $cookies.get('TOKEN'),
                    articleId: $stateParams.articleId,
                    title: $scope.article.title,
                    content: $scope.article.content,
                    tags: $scope.article.tags
                }
            }).then(function (res) {
                if(res.data.result){
                    // 修改成功,跳转到
                    $state.go('article', {username: $stateParams.username, articleId: $stateParams.articleId});
                }
            })
        };
        $(function () {
            $scope.getArticle();
        });
    }]);
    return updateArticleModel;
});