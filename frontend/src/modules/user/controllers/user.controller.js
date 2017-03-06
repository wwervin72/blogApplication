define([], function () {
    var deps = [];
    var userModel = angular.module('user', deps);
    userModel.controller('user.ctrl', ['$rootScope', '$scope', '$stateParams', 'http', function($rootScope, $scope, $stateParams, http){
        (function () {
            http.request({
                type: 'GET',
                url: '/user/posts?username=' + $stateParams.username
            }).then(function (res) {
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
            }, function (res) {

            })
        }());             
    }]);
    return userModel;
});