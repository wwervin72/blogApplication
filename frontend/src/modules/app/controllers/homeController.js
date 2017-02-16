define(['angular', 'jquery'], (angular, $) => {
    let homeCtrl = ['$scope', '$cookies', function($rootScope, $scope, $cookies){
    	
    }];
    let dependency = ['ngCookies'];
    let homeModule = angular.module('home', dependency);
    homeModule.controller('home.ctrl', homeCtrl);
    return homeModule;
});