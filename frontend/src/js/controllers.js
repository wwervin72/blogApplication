const headerCtrl = app.controller('header.ctrl', ['$rootScope', '$scope', '$cookies', '$state', 'http', function ($rootScope, $scope, $cookies, $state, http) {
	let headerTimer = setTimeout(function () {
		$('#header').animate({marginTop: '-80px'}, 500);
	}, 3000);
	$scope.headerAniFinish = true;
	// header开关动画
	$scope.toggleHeader = function () {
		let t = parseInt($('#header').css('margin-top'), 10);
		clearTimeout(headerTimer);
		if($scope.headerAniFinish){
			$scope.headerAniFinish = false;
			if(t === 0){
				$('#header').animate({marginTop: '-80px'}, 500, function () {
					$scope.headerAniFinish = true;
				});
			}else{
				$('#header').animate({marginTop: 0}, 500, function () {
					$scope.headerAniFinish = true;
				});
			}
		}
	}
	//登陆
	$scope.popUpLoginLayer = function () {
		layer.open({
			type: 1,
			skin: 'layui-layer-molv',
			shade: false,
			title: '登陆',
			area: ['300px', '300px'],
			content: $('#loginLayer'),
			closeBtn: 0,
			btn: ['取消'],
			yes: function (index, layero) {
				$('#loginMsg').hide();
				layer.close(index);
			}
		});
	};
    $scope.loginUser = {
        username: '',
        password: '',
        captcha: ''
    };
    $scope.login = function () {
    	if($scope.loginUser.username === ''){
    		$('#loginMsg').show().find('>div').html('请输入用户名');
    		return;
    	}
    	if($scope.loginUser.password === ''){
    		$('#loginMsg').show().find('>div').html('请输入密码');
    		return;
    	}
    	http.request({
    		method: 'POST',
    		url: '/login',
    		data: $scope.loginUser,
    		'Content-Type': 'application/json'
    	}).then(function (res) {
			if(res.data.result){
				$('#loginMsg').hide();
				layer.closeAll();
				$rootScope.getUserInfo();
				$('#loginMsg').hide();
			}else{
				$('#loginMsg').show().find('>div').html(res.data.msg);
			}    		
    	}, function (res) {
    		console.log(res);
    	});
    };
	// 获取token后，获取用户的信息
	$rootScope.getUserInfo = function () {
		let token = $cookies.get('TOKEN');
		if(!token || $rootScope.userInfo){
			return;
		}
		http.request({
			method: 'GET',
			url: '/userinfo?token=' + token
		}).then(function (res) {
			if(res.data.result){
				$rootScope.userInfo = {
					nickname: res.data.user.nickname,
					username: res.data.user.username,
					avatar: res.data.user.avatar
				};
			}
		}, function (res) {
			console.log(res)
		});
	};
	$rootScope.getUserInfo()
	// 登出
	$scope.loginOut = function (){
		http.request({
			method: 'GET',
			url: '/logout?token=' + $cookies.get('TOKEN')
		}).then(function (res) {
			if(res.data.result){}
				$cookies.remove("TOKEN", {path: '/'});
				delete $rootScope.userInfo;
		});
	};
	$scope.goRegister = function () {
		$('#header').animate({
			marginTop: '-80px'
		}, 500);
		layer.closeAll();
		$state.go('register');
	}
}]);

const homeCtrl = app.controller('home.ctrl', ['$rootScope', '$scope', '$cookies', 'http', function($rootScope, $scope, $cookies, http){
	$scope.posts = [];
	$scope.getAllPosts = function () {
		http.request({
			method: 'GET',
			url: '/posts',
		}).then(function (res) {
			if(res.data.result){
				$scope.posts = res.data.data;
			}
		})
	};
	$scope.getAllPosts();
}]);

const registerCtrl = app.controller('register.ctrl', ['$rootScope', '$scope', '$state', 'http', function($rootScope, $scope, $state, http){
	$scope.newUser = {
		username: '',
		password: '',
		nickname: '',
		avatar: '',
		email: ''
	};
	$scope.unique = {
		email: false,
		username: false
	};
	$scope.register = function () {
		if($scope.registerForm.$invalid || !$scope.unique.username || !$scope.unique.email){
			return;
		}
		http.request({
			method: 'POST',
			url: '/register',
			data: $scope.newUser
		}).then(function (res) {
			$('#registerMsg').show().find('>div').html(res.data.msg); 
    		if(res.data.result){
    			$('#registerMsg>div').addClass('success');
				http.request({
		    		method: 'POST',
		    		url: '/login',
		    		data: {
		    			username: $scope.newUser.username,
		    			password: $scope.newUser.password
		    		},
		    		'Content-Type': 'application/json'
		    	}).then(function (data) {
		    		if(data.data.result){
			    		$state.go('home');
			    		$rootScope.getUserInfo();
		    		}
		    	})
				for(let prop in $scope.newUser){
					$scope.newUser[prop] = '';
				}
    		}else{
    			$('#registerMsg>div').addClass('error');
    		}
		}, function (res) {

		})
	};

	$scope.checkUnique = function (obj) {
		obj = $(obj.target);
		let val = obj.val();
		let id = obj.attr('id');
		if(val !== '' && $scope.registerForm[id].$valid){
			http.request({
				method: 'GET',
				url: '/register/unique?'+id+'='+val
			}).then(function (res) {
				if(res.data.result){
					$scope.unique[id] = true;
				}else{
					$scope.unique[id] = false;
					obj.parent().find('++div>span').eq(0).show();
					obj.parent().find('++div>span').eq(1).hide();
				}
			}, function () {

			})
		}
	};
	$scope.changeIpt = function (e) {
		let event = window.event || e;
		let target = event.target || event.srcElement;
		$scope.unique[target.id] = false;
		$(target).parent().find('++div>span').eq(0).hide();
		if($scope.registerForm[target.id].$valid){
			$(target).parent().find('++div>span').eq(1).show();
		}
	}
}]);

const userCtrl = app.controller('user.ctrl', ['$scope', '$stateParams', '$state', 'http', function($scope, $stateParams, $state, http){
	$scope.getUserPosts = function () {
		http.request({
			type: 'GET',
			url: '/user/posts?username=' + $stateParams.username
		}).then(function (res) {
			if(!res.data.result && res.data.msg === '404 not found'){
				$state.go('404');
			}
		}, function (res) {

		})
	};
	$scope.getUserPosts();
}]);

const createPostCtrl = app.controller('createPost.ctrl', ['$scope', '$cookies', 'http', function($scope, $cookies, http){
	$scope.newPost = {
		title: '',
		content: '',
		tags: ''
	};
	$scope.createPost = function () {
		if($scope.newPost.title === '' || $scope.newPost.content === '' || $scope.newPost.tags === ''){
			return;
		}
		$scope.newPost.token = $cookies.get('TOKEN');
		http.request({
			method: 'POST',
			url: '/user/post',
			data: $scope.newPost
		}).then(function (res) {
			console.log(res)
		});
	}
}]);

const postCtrl = app.controller('post.ctrl', ['$scope', function($scope){
	
}]);