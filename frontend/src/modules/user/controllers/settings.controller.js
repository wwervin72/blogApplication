define([], function () {
	var deps = [];
	var settingsModel = angular.module('settings', deps);
	settingsModel.controller('settings.ctrl', ['$rootScope', '$scope', '$cookies', '$state', 'http', function($rootScope, $scope, $cookies, $state, http){
		if(!$rootScope.userInfo){
			$state.go('home', {home: {login: true, register: false}});
			return;
		}
		$scope.modifyAvatar = function () {
			$('.avatarFile').click();
		};
		$scope.settingInfo = {
			nickname: $rootScope.userInfo.nickname,
			email: $rootScope.userInfo.email,
			oldPwd: '',
			newPwd: '',
			repeatPwd: '',
			sex: $rootScope.userInfo.sex,
			bio: $rootScope.userInfo.bio,
			url: $rootScope.userInfo.url
		};
		$('.avatarFile').change(function (e) {
			var event = e || window.event;
			var target = event.target || event.srcElement;
			if(e.preventDefault){  
				e.preventDefault();	
			}else{
				e.returnValue = false;
			}
			var files = target.files || event.dataTransfer.files;
			http.uploadFile({
				url: '/user/avatar?token='+$cookies.get('TOKEN'),
				files: files
			}).then(function (res) {
				if(res.data.result){
					$rootScope.userInfo.avatar = res.data.data;
				}else{
					alert('修改失败');
				}
			});
		});
		$scope.saveBaseSetting = function () {
			if($scope.settingInfo.nickname === $rootScope.userInfo.nickname && $scope.settingInfo.email === $rootScope.userInfo.email){
				alert('请进行修改之后在保存');
				return;
			}
			http.request({
				method: 'PUT',
				url: '/user/basesettings',
				data: {
					token: $cookies.get('TOKEN'),
					nickname: $scope.settingInfo.nickname,
					email: $scope.settingInfo.email
				}
			}).then(function (res) {
				if(res.data.result){
					$rootScope.userInfo.nickname = $scope.settingInfo.nickname;
					$rootScope.userInfo.email = $scope.settingInfo.email;
					alert('修改成功');
				}else{
					if(res.data.msg === '该邮箱已被占用'){
						alert('修改失败');
					}
					alert('修改失败');
				}
			})
		};
		$scope.savePersionInfo = function () {
			if($scope.settingInfo.sex === $rootScope.userInfo.sex && $scope.settingInfo.bio === $rootScope.userInfo.bio && $scope.settingInfo.url === $rootScope.userInfo.url){
				alert('请做出修改之后再进行保存');
				return;
			}
			// if(){
			// 	alert('个人网站地址格式不正确');
			// 	return;
			// }
			http.request({
				method: 'PUT',
				url: '/user/persionalInfo',
				data: {
					token: $cookies.get('TOKEN'),
					sex: $scope.settingInfo.sex,
					bio: $scope.settingInfo.bio,
					url: $scope.settingInfo.url
				}
			}).then(function (res) {
				if(res.data.result){
					$rootScope.userInfo.sex = $scope.settingInfo.sex;
					$rootScope.userInfo.bio = $scope.settingInfo.bio;
					$rootScope.userInfo.url = $scope.settingInfo.url;
					alert('修改成功');
				}else{
					alert('修改失败');
				}
			})
		};
		$scope.modifyPwd = function () {
			if($scope.settingInfo.oldPwd === ''){
				alert('请输入原密码');
				return;
			}
			if($scope.settingInfo.newPwd === ''){
				alert('请输入新密码');
				return;
			}
			if($scope.settingInfo.repeatPwd === ''){
				alert('请确认新密码');
				return;
			}
			if($scope.settingInfo.repeatPwd !== $scope.settingInfo.newPwd){
				alert('新密码与确认密码不一致');
				return;
			}
			if(!/^[a-zA-Z0-9-_.]{3,12}$/.test($scope.settingInfo.newPwd)){
				alert('密码格式不通过');
				return;
			}
			http.request({
				method: 'PUT',
				url: '/user/pwd',
				data: {
					token: $cookies.get('TOKEN'),
					oldPwd: $scope.settingInfo.oldPwd,
					newPwd: $scope.settingInfo.newPwd
				}
			}).then(function (res) {
				if(res.data.result){
					alert('密码修改成功, 你需要从新登陆');
					delete $rootScope.userInfo;
					$state.go('home', {home: {login: true, register: false}});
				}else{
					if(res.data.msg === '原密码不正确'){
						alert('原密码不正确');
						return;
					}
					alert('密码修改失败');
				}
			})
		};
		$scope.deleteCount = function () {
			var val = confirm('请确认删除');
			if(val){
				http.request({
					method: 'DELETE',
					url: '/user/count',
					data: {
						token: $cookies.get('TOKEN')
					}
				}).then(function (res) {
					if(res.data.result){
						// 删除成功, 需要从新登陆
						alert('删除成功, 你需要重新登陆');
						delete $rootScope.userInfo;
						$state.go('home', {home:{login: true, register: false}});
					}else{
						alert('删除失败');
					}
				});
			}
		};
		$(function () {
			$('.setting_list a').click(function (e) {
				var event = e || window.event;
				var target = event.target || event.srcElement;
				target = $(target);
				var index = target.parent().index();
				$('.setting_list a').removeClass('active');
				target.addClass('active');
				$('.setting_cnt > div').hide();
				$('.setting_cnt > div').eq(index).show();
			});
		});
	}]);
	return settingsModel;
});