define(['marked'], function (marked){
    var deps = [];
    var articlesModel = angular.module('articles', deps);
    articlesModel.controller('articles.ctrl', ['$rootScope','$scope','$state','http','message-service', function($rootScope,$scope,$state,http,message){
        (function () {
            http.request({
                method: 'GET',
                url: '/posts'
            }).then(function (res) {
                if(res.data.result){
                    $scope.articles = res.data.data;
                }else{
                    message({type: 'error', text: '数据获取失败，请刷新页面'});
                }
            })
        }());
    }]);
    return articlesModel;
});