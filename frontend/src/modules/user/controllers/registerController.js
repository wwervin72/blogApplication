define(['angular', 'jquery', 'ngCookies'], (angular, $) => {
    let registerCtrl = ['$scope', '$cookies', function($scope, $cookies){
        $scope.user = {
        	username: '',
        	username: ''
        };
        $scope.register = function () {
        	if($scope.user.username && $scope.user.password){
                $scope.user.token = $cookies.get('TOKEN');
        		let promise = $.ajax({
                    type: 'POST',
                    url: 'http://localhost:3000/signup',
                    data: $scope.user,
                    dataType: 'json'
                });
                promise.then(function (res) {
                    console.log(res)
                }, function (res) {
                    console.log(res)
                });
        	}else{
        		alert('请输入用户名密码');
        	}
        }
    }];
    let dependency = ['ngCookies'];
    let registerModule = angular.module('register', dependency);
    registerModule.controller('register.ctrl', registerCtrl);
    return registerModule;
});