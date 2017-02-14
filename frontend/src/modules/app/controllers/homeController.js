define(['angular'], (angular) => {
    let homeCtrl = ['$scope', function($scope){

    }];
    let dependency = [];
    let homeModule = angular.module('home', dependency);
    homeModule.controller('home.ctrl', homeCtrl);
    return homeModule;
});