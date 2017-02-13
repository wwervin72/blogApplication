define(['angular', 'jquery'], (angular, $) => {
    let loginCtrl = ['$scope', '$http', function($scope, $http){
        $scope.user = {
            username: '',
            password: ''
        };
        $scope.login = function () {
            let promise = $.ajax({
                type: 'POST',
                url: 'http://localhost:3030/signIn',
                data: $scope.user,
                dataType: 'json'
            });
            promise.then(function (res) {
                console.log(res)
            }, function (res) {
                console.log(res)
            });
        }
    }];
    let dependency = [];
    let loginModule = angular.module('login', dependency);
    loginModule.controller('login.ctrl', loginCtrl);
    return loginModule;
});