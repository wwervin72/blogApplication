define([], function () {
	var deps = [];
	var findPwdModel = angular.module('findPwd', deps);
	findPwdModel.controller('findPwd.ctrl', ['$scope','http','message-service', function($scope,http,message){
		$scope.resetPwdInfo = {
			username: '',
			email: '',
			authCode: '',
			newPwd: '',
			repeatPwd: ''
		};
		// 发送邮件获取验证码
		$scope.sendAuthCode = function () {
			if($scope.resetPwdInfo.username === ''){
				message({type: 'info', text: '请输入注册账号'});
				return;
			}
			if($scope.resetPwdInfo.email === ''){
				message({type: 'info', text: '请输入账号绑定邮箱'});
				return;
			}
			if(!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test($scope.resetPwdInfo.email)){
				message({type: 'info', text: '邮箱格式不正确'});
				return;
			}
			http.request({
				method: 'GET',
				url: '/pwd/authCode?username='+$scope.resetPwdInfo.username+'&email='+$scope.resetPwdInfo.email
			}).then(function (res) {
				if(res.data.result){
					message({type: 'success', text: '邮件发送成功，30分钟内有效，请注意查收'});
				}
			})
		};
		// 重置密码
		$scope.resetPwd = function () {
			if($scope.resetPwdInfo.username === ''){
				message({type: 'info', text: '请输入注册账号'});
				return;
			}
			if($scope.resetPwdInfo.email === ''){
				message({type: 'info', text: '请输入账号绑定邮箱'});
				return;
			}
			if($scope.resetPwdInfo.authCode === ''){
				message({type: 'info', text: '请输入验证码'});
				return;
			}
			if($scope.resetPwdInfo.newPwd === ''){
				message({type: 'info', text: '请输入新密码'});
				return;
			}
			if($scope.resetPwdInfo.repeatPwd === ''){
				message({type: 'info', text: '请重复新密码'});
				return;
			}
			if($scope.resetPwdInfo.repeatPwd !== $scope.resetPwdInfo.newPwd){
				message({type: 'info', text: '新密码与重复新密码不一致'});
				return;
			}
			if(!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test($scope.resetPwdInfo.email)){
				message({type: 'info', text: '邮箱格式不正确'});
				return;
			}
			http.request({
				method: 'PUT',
				url: '/pwd',
				data: {
					username: $scope.resetPwdInfo.username,
					email: $scope.resetPwdInfo.email,
					authCode: $scope.resetPwdInfo.authCode,
					newPwd: $scope.resetPwdInfo.newPwd
				}
			}).then(function (res) {
				$scope.resetPwdInfo.authCode = '';
				if(res.data.result){
					message({type: 'success', text: res.data.msg});
					$scope.resetPwdInfo.username = '';
					$scope.resetPwdInfo.email = '';
					$scope.resetPwdInfo.newPwd = '';
					$scope.resetPwdInfo.repeatPwd = '';
				}else{
					message({type: 'error', text: res.data.msg});
				}
			});
		};
	}]);
	return findPwdModel;
});