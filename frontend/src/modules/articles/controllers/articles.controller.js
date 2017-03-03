define([], function (){
    var deps = [];
    var articlesModel = angular.module('articles', deps);
    articlesModel.controller('articles.ctrl', ['$scope', 'http', function($scope, http){
        (function () {
            http.request({
                method: 'GET',
                url: '/posts'
            }).then(function (res) {
                if(res.data.result){
                    res.data.data.forEach(function (item) {
                        item.createAt = $rootScope.parseTime(item.createAt);
                    })
                    $scope.posts = res.data.data;
                }
            })
        }());
    }]);
    return articlesModel;
});