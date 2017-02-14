define(['angular'], (angular) => {
    let registerCtrl = ['$scope', function($scope){
        $scope.user = {
        	username: '',
        	username: ''
        };
        $scope.register = function () {
        	if($scope.user.username && $scope.user.password){
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
    let dependency = [];
    let registerModule = angular.module('register', dependency);
    registerModule.controller('register.ctrl', registerCtrl);
    return registerModule;
});