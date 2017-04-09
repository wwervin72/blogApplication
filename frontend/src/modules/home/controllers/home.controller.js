define([], function (){
    var deps = [];
    var homeModel = angular.module('home', deps);
    homeModel.controller('home.ctrl', ['$rootScope','$scope','$stateParams','$state','$location','$cookies','http','message-service', function($rootScope,$scope,$stateParams,$state,$location,$cookies,http,message){
        $('#login input[name=username]').focus();
        $scope.home = $stateParams.home ? $stateParams.home : {register: false, login: true};
        $scope.registerUser = {
            username: '',
            email: '',
            authcode: '',
            password: '',
            replayPwd: '',
            nickname: ''
        };
        $scope.loginUser = {
            username: '',
            password: ''
        };
        $scope.loginFailed = false;
        $('.ipt_group input').on('focus', function () {
            var _this = $(this);
            if(_this.parents('#login').length){
                $scope.loginFailed = false;
                $scope.$apply(function () {
                    $scope.verifyLogin[_this.attr('name')] = false;
                });
            }else{
                $scope.$apply(function () {
                    $scope.verifyRegister[_this.attr('name')] = false;
                });
            }
        });
        $scope.hideRegisterMsg = function () {
            $scope.home={
                login: true, 
                register: false
            };
            $scope.verifyRegister = {username: false,email: false,authcode: false,password: false,replayPwd: false};
        };
        $scope.hideLoginMsg = function () {
            $scope.home={
                login: false, 
                register: true
            };
            $scope.verifyLogin = {username: false, password: false};
        };
        $scope.verifyLogin = {username: false, password: false};
        $scope.login = function () {
            $scope.verifyLogin = {username: true, password: true};
            if($scope.login_form.$invalid){
                return;
            }
            http.request({
                method: 'POST',
                url: '/login',
                data: $scope.loginUser
            }).then(function (res) {
                message({type: res.data.result ? 'success' : 'error', text: res.data.msg});
                if(res.data.result){
                    // 存储cookie, 一年的过期时间
                    $cookies.remove("TOKEN", {path: '/'});
                    var timeCount = new Date().getTime() + 60 * 60 * 24 * 365;
                    var deadline = new Date(timeCount);
                    $cookies.put('TOKEN', res.data.token, {'expires': deadline, path: '/'});

                    $rootScope.userInfo = res.data.info;
                    $state.go($rootScope.prevState.name || 'articles', $rootScope.prevParams);
                }else{
                    $scope.verifyLogin.name = false;
                    $scope.loginFailed = true;
                }         
            }, function (res) {
               message({type: 'error', text: '数据请求失败'});
            });
        };
        $scope.registerSendAuthCode = function (e) {
            $scope.verifyRegister.email = true;
            var event = e || window.event;
            if(event.preventDefault){
                event.preventDefault();
            }else{
                event.returnValue = false;
            }
            if($scope.registerForm.email.$invalid){
                return;
            }
            if(!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test($scope.registerUser.email)){
                message({type: 'info', text: '邮箱格式不正确'});
                return;
            }
            http.request({
                method: 'GET',
                url: '/register/authcode?email='+$scope.registerUser.email
            }).then(function (res) {
                message({type: res.data.result ? 'success' : 'error', text: res.data.msg});
            })
        };
        $scope.verifyRegister = {username: false,email: false,authcode: false,password: false,replayPwd: false};
        $scope.register = function () {
            $scope.verifyRegister = {username: true,email: true,authcode: true,password: true,replayPwd: true};
            if($scope.registerForm.$invalid){
                return;
            }
            http.request({
                method: 'POST',
                url: '/register',
                data: $scope.registerUser
            }).then(function (res) {
                $scope.registerUser.authcode = '';
                message({type: res.data.result ? 'success' : 'error', text: res.data.msg});
                if(res.data.result){
                    // 关闭提示以及输入的内容
                    $scope.verifyRegister = {username: false,email: false,authcode: false,password: false,replayPwd: false};
                    $scope.registerUser.username = '';
                    $scope.registerUser.email = '';
                    $scope.registerUser.password = '';
                    $scope.registerUser.replayPwd = '';
                    $scope.registerUser.nickName = '';
                    // 注册成功，然后登陆 存储cookie, 一年的过期时间
                    $cookies.remove("TOKEN", {path: '/'});
                    var timeCount = new Date().getTime() + 60 * 60 * 24 * 365;
                    var deadline = new Date(timeCount);
                    $cookies.put('TOKEN', res.data.token, {'expires': deadline, path: '/'});
                    $rootScope.userInfo = res.data.info;
                    $state.go($rootScope.prevState.name || 'articles', $rootScope.prevParams);
                }
            }, function (res) {
                message({type: 'error', text: '数据请求失败'});
            });
        }

        // 背景图
        var particle = $('.bg_particle');
        particle.ready(function () {
            var particleWeb = new Particle(particle[0]);
        });
    }]);
    return homeModel;
});