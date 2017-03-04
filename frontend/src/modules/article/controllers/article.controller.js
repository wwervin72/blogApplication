define([], function () {
	var deps = [];
	var articleModel = angular.module('article', deps);
	articleModel.controller('article.ctrl', ['$rootScope', '$scope', '$stateParams', 'http', function($rootScope, $scope, $stateParams, http){
		(function () {
			http.request({
				url: '/article?username=' + $stateParams.username + '&articleId=' + $stateParams.articleId,
				method: 'GET',
			}).then(function(res) {
				if(res.data.result){
					res.data.data.createAt = $rootScope.parseTime(res.data.data.createAt);
					$scope.article = res.data.data;
				}
			});
		}())
	}]);
	return articleModel;
})