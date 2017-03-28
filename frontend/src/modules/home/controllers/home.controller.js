define([], function (){
    var deps = [];
    var homeModel = angular.module('home', deps);
    homeModel.controller('home.ctrl', ['$rootScope', '$scope', '$stateParams', '$state', '$location', 'http', function($rootScope, $scope, $stateParams, $state, $location, http){
        $('#login input[name=username]').focus();
        $scope.home = $stateParams.home ? $stateParams.home : {register: false, login: true};
        $scope.registerUser = {
            username: '',
            password: '',
            replayPwd: '',
            nickName: '',
            email: ''
        };
        $scope.loginUser = {
            username: '',
            password: ''
        };
        $scope.accountExist = false;
        $scope.loginFailed = false;
        $(function () {
            $('.iptMsg').each(function (i, item) {
                item = $(item);
                item.css('right', -parseInt(item.css('width')) + 'px');
            });
        })
        $('.from_content').on('.iptMsg span', 'click', function () {
            $(this).parent().prev().focus();
        });
        $('.from_content').on('input', 'focus', function () {
            $scope.loginFailed = false;
            $scope.hideMsg($(this).next('.iptMsg'));
        });
        $scope.showMsg = function (dom) {
            dom.css('display', 'block');
            dom.animate({
                opacity: 1,
                right: '10px'
            }, 300);
        };
        $scope.hideMsg = function (dom) {
            dom.animate({
                opacity: 0,
                right: -parseInt(dom.css('width')) + 'px'
            }, 300)
        };
        $scope.hideRegisterMsg = function () {
            $scope.hideMsg($('#register .iptMsg'));
        };
        $scope.hideLoginMsg = function () {
            $scope.hideMsg($('#login .iptMsg'));
        }
        $scope.login = function () {
            $scope.showMsg($('#login .iptMsg'));
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
                    $state.go($rootScope.prevState.name || 'articles', $rootScope.prevParams);
                }else{
                    $scope.loginFailed = true;
                }         
            }, function (res) {
               
            });
        };
        $scope.register = function () {
            $scope.showMsg($('#register .iptMsg'));
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
                    $scope.hideMsg($('#register .iptMsg'));
                    for(var prop in $scope.registerUser){
                        $scope.registerUser[prop] = '';
                    }
                    $rootScope.userInfo = res.data.info;
                    $location.path(sessionStorage.redirectTo? sessionStorage.redirectTo : '/a');
                }else{
                    // 注册失败
                    
                }
            }, function (res) {
                console.log(res)
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