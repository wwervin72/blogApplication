define([], function (){
    var deps = [];
    var articlesModel = angular.module('articles', deps);
    articlesModel.controller('articles.ctrl', ['$rootScope', '$scope', 'http', function($rootScope, $scope, http){
        (function () {
            http.request({
                method: 'GET',
                url: '/posts'
            }).then(function (res) {
                if(res.data.result){
                    $scope.articles = res.data.data;
                }
            })
        }());
    }]);
    return articlesModel;
});