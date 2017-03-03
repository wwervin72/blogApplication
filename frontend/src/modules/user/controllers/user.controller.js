define([], function () {
    var deps = [];
    var userModel = angular.module('user', deps);
    userModel.controller('user.ctrl', ['$scope', '$stateParams', 'http', function($scope, $stateParams, http){
        (function () {
            http.request({
                type: 'GET',
                url: '/user/posts?username=' + $stateParams.username
            }).then(function (res) {
                if(!res.data.result && res.data.msg === '404 not found'){
                    $state.go('404');
                }
                if(res.data.data.result){
                    $scope.userPosts = res.data.data;
                }
            }, function (res) {

            })
        }());             
    }]);
    return userModel;
});