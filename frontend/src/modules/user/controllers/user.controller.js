define([], function () {
    var deps = [];
    var userModel = angular.module('user', deps);
    userModel.controller('user.ctrl', ['$rootScope', '$scope', '$stateParams', 'http', function($rootScope, $scope, $stateParams, http){
        (function () {
            http.request({
                type: 'GET',
                url: '/user/posts?username=' + $stateParams.username
            }).then(function (res) {
                $scope.articles = res.data.data;
            }, function (res) {
                
            })
        }());             
    }]);
    return userModel;
});