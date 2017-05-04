define(['angular'], function (angular) {
	var dependency = [];
	var ervinModel = angular.module('ervin', dependency);
	ervinModel.controller('ervin.ctrl', ['$rootScope','$scope', function($rootScope,$scope){
		$('.sidebar_menu a').on('click', function (event) {
			$(event.target).next('.sidebar_menu').toggle();			
		});
	}]);
	return ervinModel;
});