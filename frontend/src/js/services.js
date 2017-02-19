app.factory('http', ['$http', function($http){
	let baseUrl = 'http://localhost:3000';
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

app.factory('tokenInterceptor', ['$q', '$cookies', function($q, $cookies){
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
                let timeCount = new Date().getTime() + 1000 * 60 * 30;
                let deadline = new Date(timeCount);
                $cookies.put('TOKEN', res.data.token, {'expires': deadline, path: '/'});
			}
			return res;
		},
		responseError: function (rejection) {
			return $q.reject(rejection)
		}
	};
}]);