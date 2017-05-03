define(['angular'], function (angular) {
	var dependency = [];
	var ervinModel = angular.module('ervin', dependency);
	ervinModel.controller('ervin.ctrl', ['$rootScope','$scope', function($rootScope,$scope){
		console.log($rootScope)
		console.log($rootScope.userInfo)
		$('.sidebar_menu a').on('click', function (event) {
			$(event.target).next('.sidebar_menu').toggle();			
		});
	}]);
	return ervinModel;
});