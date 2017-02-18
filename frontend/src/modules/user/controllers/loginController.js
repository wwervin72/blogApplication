define(['angular', 'jquery', 'ngCookies'], (angular, $) => {
    let loginCtrl = ['$scope', '$cookies', '$state', function($scope, $cookies, $state){
        $scope.user = {
            username: '',
            password: '',
            captcha: ''
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
                        let timeCount = new Date().getTime() + 1000 * 60 * 30;
                        let deadline = new Date(timeCount);
                        $cookies.put('TOKEN', res.token, {'expires': deadline, path: '/'});
                    }
                }, function (res) {
                    console.log(res)
                });
            }else{
                alert('请输入账号密码');
            }
        };
        $scope.getCaptcha = function () {
            $.ajax({
                type: 'GET',
                url: 'http://localhost:3000/captcha',
            }).then(function (res) {
                let img = new Image();
                img.src = res;
                img.width = 100;
                img.height = 30;
                $('#refreshCaptcha').after(img);
            }, function () {

            }) 
        };
    }];
    let dependency = ['ngCookies'];
    let loginModule = angular.module('login', dependency);
    loginModule.controller('login.ctrl', loginCtrl);
    return loginModule;
});