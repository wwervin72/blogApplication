define([], function () {
    var deps = ['ui.bootstrap.pagination'];
    var userModel = angular.module('user', deps);
    userModel.controller('user.ctrl', ['$rootScope', '$scope', '$stateParams', 'http', function($rootScope, $scope, $stateParams, http){
        $scope.getArticles = function (currentPage, pageNum) {
            pageNum = pageNum ? pageNum : 10;
            http.request({
                type: 'GET',
                url: '/user/posts?username=' + $stateParams.username+'&currentPage='+currentPage+'&pageNum='+pageNum
            }).then(function (res) {
                $scope.articles = res.data.data;
                $scope.totalArticles = res.data.total;
            }, function (res) {
                
            })
        }          
        $scope.maxSize = 5;
        $scope.totalArticles = 1;
        $scope.currentPage = 1;
        
        $scope.getArticles($scope.currentPage);  
    }]);
    return userModel;
});