define([], function () {
	var deps = [];
	var findPwdModel = angular.module('findPwd', deps);
	findPwdModel.controller('findPwd.ctrl', ['$scope', 'http', function($scope, http){
		$scope.findPwd = function () {
			http.request({
				method: 'POST',
				url: '/pwd',
				data: {
					username: 'ervin',
					email: 'lw_ervin@sina.cn',
					newPwd: 123456
				}
			}).then(function (res) {
				console.log(res);
			})
		}
	}]);
	return findPwdModel;
});