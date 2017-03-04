define([], function () {
    var httpRequest = angular.module('httpRequest', []);
    httpRequest.factory('http', ['$http', function($http){
        var baseUrl = 'http://localhost:3000';
        function request (config) {
            return $http({
                method: config.method || 'GET',
                url: baseUrl + config.url || '',
                headers: {
                    'Content-Type': 'application/json' || config['Content-Type']
                },
                data: config.data || {}
            });
        }
        return {
            request: request
        };
    }]);

    httpRequest.factory('tokenInterceptor', ['$q', '$cookies', '$location', function($q, $cookies, $location){
        return {
            request: function (config) {
                return config;
            },
            requestError: function (rejection) {
                return $q.reject(rejection)
            },
            response: function (res) {
                // 如果返回了token则需要把token刷新时间
                if(res.status === 200 && res.data.result && res.data.token){
                    $cookies.remove("TOKEN", {path: '/'});
                    var timeCount = new Date().getTime() + 1000 * 60 * 30;
                    var deadline = new Date(timeCount);
                    $cookies.put('TOKEN', res.data.token, {'expires': deadline, path: '/'});
                }
                return res;
            },
            responseError: function (rejection) {
                if(rejection.status === 404){
                    $location.path('/404');
                }
                if(rejection.status === 500){
                    $location.path('/500');
                }
                return $q.reject(rejection);
            }
        };
    }]);
    return httpRequest;
});