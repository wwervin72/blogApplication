define(['marked'], function (marked){
    var deps = ['carousel','ui.bootstrap.pagination'];
    var articlesModel = angular.module('articles', deps);
    articlesModel.controller('articles.ctrl', ['$rootScope','$scope','$state','http','message-service', function($rootScope,$scope,$state,http,message){
        // 获取文章
        $scope.getArticles = function (currentPage, pageNum) {
            // 默认每页显示10篇文章
            pageNum = pageNum ? pageNum : 10;
            http.request({
                method: 'GET',
                url: '/posts?currentPage='+currentPage+'&pageNum='+pageNum
            }).then(function (res) {
                if(res.data.result){
                    $scope.articles = res.data.data;
                    $scope.totalArticles = res.data.total;
                }else{
                    message({type: 'error', text: '数据获取失败，请刷新页面'});
                }
            })
        };
        $scope.setPage = function (pageNo) {
            // $scope.currentPage = pageNo;
            // };

            // $scope.pageChanged = function() {
            // $log.log('Page changed to: ' + $scope.currentPage);
        };

        $scope.maxSize = 5;
        $scope.totalArticles = 1;
        $scope.currentPage = 1;
        
        $scope.getArticles($scope.currentPage);

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
    }]);
    return articlesModel;
});