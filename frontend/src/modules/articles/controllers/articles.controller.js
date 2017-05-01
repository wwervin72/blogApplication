define(['marked'], function (marked){
    var deps = ['carousel','ui.bootstrap.pagination'];
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
        $scope.carouselWidth = parseInt($('.articlesContent').css('width'));
        $scope.carouselHeight = $scope.carouselWidth / 3;
        $scope.carousels = [
            {
                html: 0
            },
            {
                html: 1
            },
            {
                html: 2
            },
            {
                html: 3
            },
            {
                html: 4
            },
            {
                html: 5
            },
            {
                html: 6
            },
            {
                html: 7
            },
            {
                html: 8
            },
            {
                html: 9
            }
        ];
        
        $scope.totalItems = 64;
        $scope.currentPage = 4;

        $scope.setPage = function (pageNo) {
            // $scope.currentPage = pageNo;
            // };

            // $scope.pageChanged = function() {
            // $log.log('Page changed to: ' + $scope.currentPage);
        };

        $scope.maxSize = 5;
        $scope.bigTotalItems = 175;
        $scope.bigCurrentPage = 1;
    }]);
    return articlesModel;
});