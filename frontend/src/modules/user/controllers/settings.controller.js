define([], function () {
	var deps = [];
	var settingsModel = angular.module('settings', deps);
	settingsModel.controller('settings.ctrl', ['$rootScope', '$scope', '$cookies', '$state', 'http', function($rootScope, $scope, $cookies, $state, http){
		$scope.modifyAvatar = function () {
			$('.avatarFile').click();
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
		$scope.deleteCount = function () {
			http.request({
				method: 'DELETE',
				url: '/user/count'
			}).then(function (res) {
				if(res.data.result){
					// 删除成功, 需要从新登陆
					alert('删除成功, 你需要重新登陆');
					delete $rootScope.userInfo;
					$state.go('home', {home:{login: true, register: false}});
				}else{
					alert('删除失败');
				}
			})
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