define(['angular', 'jquery', 'ngCookies'], (angular, $) => {
    let loginCtrl = ['$scope', '$cookies', '$state', function($scope, $cookies, $state){
        $scope.user = {
            username: '',
            password: ''
        };
        $scope.login = function () {
            if($scope.user.username && $scope.user.password){
                let promise = $.ajax({
                    type: 'POST',
                    url: 'http://localhost:3000/signIn',
                    data: $scope.user,
                    dataType: 'json'
                });
                promise.then(function (res) {
                    if(res.result){
                        $state.go('home');
                        $cookies.remove("TOKEN", {path: '/'});
                        var timeCount = new Date().getTime() + 1000 * 60 * 30;
                        var deadline = new Date(timeCount);
                        $cookies.put('TOKEN', res.token, {'expires': deadline, path: '/'});
                    }
                }, function (res) {
                    console.log(res)
                });
            }else{
                alert('请输入账号密码');
            }
        }
    }];
    let dependency = ['ngCookies'];
    let loginModule = angular.module('login', dependency);
    loginModule.controller('login.ctrl', loginCtrl);
    return loginModule;
});