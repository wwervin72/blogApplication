define([], function (){
    var deps = [];
    var homeModel = angular.module('home', deps);
    homeModel.controller('home.ctrl', ['$rootScope', '$scope', '$stateParams', '$state', '$location', 'http', function($rootScope, $scope, $stateParams, $state, $location, http){
        $scope.home = $stateParams.home ? $stateParams.home : {register: false, login: true};
        $scope.register = {
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
        $scope.showMsg = {
            login:  false,
            register: false
        };
        $scope.login = function () {
            $scope.showMsg.login = true;
            // http.request({
            //     method: 'POST',
            //     url: '/login',
            //     data: $scope.loginUser
            // }).then(function (res) {
            //     if(res.data.result){
            //         $rootScope.userInfo = res.data.info;
            //         $location.path(sessionStorage.redirectTo? sessionStorage.redirectTo : '/a');
            //     }         
            // }, function (res) {
            //     console.log(res);
            // });
        };
        $('.from_content').delegate('#login .iptMsg span, #register .iptMsg span', 'click', function () {
            $(this).parent().prev().focus();
        });
        $('.from_content').delegate('input', 'focus', function () {
            var iptMsg = $(this).next('.iptMsg');
            if(iptMsg.length && iptMsg.css('display') === 'block'){
                iptMsg.css('display', 'none');
            }
        });

        // 背景图
        var particle = $('.bg_particle');
        particle.ready(function () {
            var particleWeb = new Particle(particle[0]);
        });
    }]);
    return homeModel;
});