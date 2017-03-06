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
                    res.data.data.map(function (item) {
                        $(item.content).each(function (i, ele) {
                            if(!i){
                                item.content = '';
                            }
                            if(ele.nodeName !== 'PRE'){
                                item.content += $(ele).text().trim();
                            }
                        })
                    });
                    $scope.articles = res.data.data;
                }
            })
        }());
    }]);
    return articlesModel;
});