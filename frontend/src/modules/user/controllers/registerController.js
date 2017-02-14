define(['angular'], (angular) => {
    let registerCtrl = ['$scope', function($scope){
        
    }];
    let dependency = [];
    let registerModule = angular.module('register', dependency);
    registerModule.controller('register.ctrl', registerCtrl);
    return registerModule;
});