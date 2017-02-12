define(['angular'], (angular) => {
	let appCtrl = ['$scope', ($scope) => {
		
	}];
	let dependency = [];
	let appModule = angular.module('app', dependency);
	appModule.controller('ctrl', appCtrl);
	return appModule;
});