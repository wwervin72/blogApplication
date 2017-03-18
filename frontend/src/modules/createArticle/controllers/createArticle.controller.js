define([], function () {
    var deps = [];
    var createArticleModel = angular.module('createArticle', deps);
    createArticleModel.controller('createArticle.ctrl', ['$rootScope', '$scope', '$cookies', '$state', 'http', function($rootScope, $scope, $cookies, $state, http){
        $scope.createArticle = function () {
        	http.request({
        		method: 'POST',
        		url: '/user/article',
        		data: {
        			token: $cookies.get('TOKEN'),
        			title: $scope.newArticle.title,
        			content: $scope.newArticle.content,
        			tags: $scope.newArticle.tags
        		}
        	}).then(function (res) {
        		if(res.data.result){
        			$state.go('user', {username: $rootScope.userInfo.username});
        		}
        	});
        }
    }]);
    return createArticleModel;
});