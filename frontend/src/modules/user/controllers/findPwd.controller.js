define([], function () {
	var deps = [];
	var findPwdModel = angular.module('findPwd', deps);
	findPwdModel.controller('findPwd.ctrl', ['$scope', 'http', function($scope, http){
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
				alert('请输入注册账号');
				return;
			}
			if($scope.resetPwdInfo.email === ''){
				alert('请输入账号绑定邮箱');
				return;
			}
			if(!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test($scope.resetPwdInfo.email)){
				alert('邮箱格式不正确');
				return;
			}
			http.request({
				method: 'GET',
				url: '/pwd/authCode?username='+$scope.resetPwdInfo.username+'&email='+$scope.resetPwdInfo.email
			}).then(function (res) {
				if(res.data.result){
					alert('邮件发送成功，30分钟内有效，请注意查收');
				}
			})
		};
		// 重置密码
		$scope.resetPwd = function () {
			if($scope.resetPwdInfo.username === ''){
				alert('请输入注册账号');
				return;
			}
			if($scope.resetPwdInfo.email === ''){
				alert('请输入账号绑定邮箱');
				return;
			}
			if($scope.resetPwdInfo.authCode === ''){
				alert('请输入验证码');
				return;
			}
			if($scope.resetPwdInfo.newPwd === ''){
				alert('请输入新密码');
				return;
			}
			if($scope.resetPwdInfo.repeatPwd === ''){
				alert('请重复新密码');
				return;
			}
			if($scope.resetPwdInfo.repeatPwd !== $scope.resetPwdInfo.newPwd){
				alert('新密码与重复新密码不一致');
				return;
			}
			if(!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test($scope.resetPwdInfo.email)){
				alert('邮箱格式不正确');
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
					$scope.resetPwdInfo.username = '';
					$scope.resetPwdInfo.email = '';
					$scope.resetPwdInfo.newPwd = '';
					$scope.resetPwdInfo.repeatPwd = '';
					alert(res.data.msg);
				}else{
					alert(res.data.msg);
				}
			});
		};
	}]);
	return findPwdModel;
});