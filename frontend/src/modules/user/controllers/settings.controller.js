define([], function () {
	var deps = [];
	var settingsModel = angular.module('settings', deps);
	settingsModel.controller('settings.ctrl', ['$scope', function($scope){
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