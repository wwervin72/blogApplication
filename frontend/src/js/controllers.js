const homeCtrl = app.controller('home.ctrl', ['$rootScope', '$scope', '$cookies', function($rootScope, $scope, $cookies){
	//登陆
	$scope.popUpLoginLayer = function () {
		layer.open({
			type: 1,
			skin: 'layui-layer-molv',
			shade: false,
			title: '登陆',
			area: ['300px', '260px'],
			content: $('#loginLayer'),
			btn: ['取消'],
			close: function (layer) {
				console.log('cancel') 
			},
			yes: function (index, layero) {
				// layer.close(index);
			}
		});
	};
    $scope.loginUser = {
        username: '',
        password: '',
        captcha: ''
    };
    $scope.login = function () {
        if($scope.loginUser.username && $scope.loginUser.password){
            let promise = $.ajax({
                type: 'POST',
                url: 'http://localhost:3000/signIn',
                data: $scope.loginUser,
                dataType: 'json'
            });
            promise.then(function (res) {
                if(res.result){
                	layer.closeAll();
                    $cookies.remove("TOKEN", {path: '/'});
                    let timeCount = new Date().getTime() + 1000 * 60 * 30;
                    let deadline = new Date(timeCount);
                    $cookies.put('TOKEN', res.token, {'expires': deadline, path: '/'});
                    // 获取用户的基本信息
                    $scope.getUserInfo()
                }else{
                	return {
                		result: false,
                		msg: res
                	};
                }
            }, function (res) {
                return {
            		result: false,
            		msg: res
            	};
            });
        }
    };
	// 获取token后，获取用户的信息
	$scope.getUserInfo = function () {
		let token = $cookies.get('TOKEN');
		if(!token || $rootScope.user){
			return;
		}
		$.ajax({
			type: 'GET',
			url: 'http://localhost:3000/userinfo?token=' + token
		}).then(function (res) {
			if(res.result){
				$scope.$apply(function () {
					$rootScope.user = res.user;
				});
				$cookies.remove("TOKEN", {path: '/'});
                let timeCount = new Date().getTime() + 1000 * 60 * 30;
                let deadline = new Date(timeCount);
                $cookies.put('TOKEN', res.token, {'expires': deadline, path: '/'});
			}else{

			}
		}, function (res) {
			console.log(res)
		});
	};
	$scope.getUserInfo()
	// 登出
	$scope.loginOut = function (){
		$.ajax({
			type: 'GET',
			url: 'http://localhost:3000/signout?token=' + $cookies.get('TOKEN')
		}).then(function (res) {
			if(res.result){
				$cookies.remove("TOKEN", {path: '/'});
				$scope.$apply(function () {
					delete $rootScope.user;
				});
			}
		}, function (res) {
			console.log(res)
		})
	};
}]);

const registerCtrl = app.controller('register.ctrl', ['$scope', function($scope){
	
}]);