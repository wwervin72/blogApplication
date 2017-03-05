define([], function () {
    var deps = [];
    var updateArticleModel = angular.module('updateArticle', deps);
    updateArticleModel.controller('updateArticle.ctrl', ['$scope', '$stateParams', '$cookies', '$state', 'http', function($scope, $stateParams, $cookies, $state, http){
        $scope.getArticle = function (editor) {
        	http.request({
        		method: 'GET',
        		url: '/article?username='+$stateParams.username+'&articleId='+$stateParams.articleId
        	}).then(function (res) {
        		$scope.article = res.data.data;
                editor.$txt.append($scope.article.content);
        	})
        };
        $scope.updateArticle = function () {
            http.request({
                method: 'PUT',
                url: '/update/article',
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
        }
    }]);
    return updateArticleModel;
});