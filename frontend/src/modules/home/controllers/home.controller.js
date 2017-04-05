define([], function (){
    var deps = [];
    var homeModel = angular.module('home', deps);
    homeModel.controller('home.ctrl', ['$rootScope','$scope','$stateParams','$state','$location','http','message-service', function($rootScope,$scope,$stateParams,$state,$location,http,message){
        $('#login input[name=username]').focus();
        $scope.home = $stateParams.home ? $stateParams.home : {register: false, login: true};
        $scope.registerUser = {
            username: '',
            email: '',
            authCode: '',
            password: '',
            replayPwd: '',
            nickName: ''
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
            $scope.verifyRegister = {username: false,email: false,authCode: false,password: false,replayPwd: false};
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
                if(res.data.result){
                    $rootScope.userInfo = res.data.info;
                    message({type: 'success', text: '登陆成功'});
                    $state.go($rootScope.prevState.name || 'articles', $rootScope.prevParams);
                }else{
                    // message({type: 'error', text: '登陆失败'});
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
                url: '/register/authCode?email='+$scope.registerUser.email
            }).then(function (res) {
                message({type: res.data.result ? 'success' : 'error', text: res.data.msg});
            })
        };
        $scope.verifyRegister = {username: false,email: false,authCode: false,password: false,replayPwd: false};
        $scope.register = function () {
            $scope.verifyRegister = {username: true,email: true,authCode: true,password: true,replayPwd: true};
            if($scope.registerForm.$invalid){
                return;
            }
            http.request({
                method: 'POST',
                url: '/register',
                data: $scope.registerUser
            }).then(function (res) {
                if(res.data.result){
                    // 注册成功，然后登陆
                    message({type: 'success', text: '注册成功'});
                    $scope.hideMsg($('#register .iptMsg'));
                    for(var prop in $scope.registerUser){
                        $scope.registerUser[prop] = '';
                    }
                    $rootScope.userInfo = res.data.info;
                    $location.path(sessionStorage.redirectTo? sessionStorage.redirectTo : '/a');
                }else{
                    // 注册失败
                    message({type: 'error', text: res.data.msg});
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