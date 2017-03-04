define([], function (){
    var deps = [];
    var homeModel = angular.module('home', deps);
    homeModel.controller('home.ctrl', ['$rootScope', '$scope', '$stateParams', '$state', 'http', function($rootScope, $scope, $stateParams, $state, http){
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
        $scope.login = function () {
            http.request({
                method: 'POST',
                url: '/login',
                data: $scope.loginUser
            }).then(function (res) {
                if(res.data.result){
                    $rootScope.userInfo = res.data.info;
                    $state.go('articles');
                }         
            }, function (res) {
                console.log(res);
            });
        };
        // 背景图
        var particle = $('.bg_particle');
        particle.ready(function () {
            var particleWeb = new Particle(particle[0]);
        });
    }]);
    return homeModel;
});