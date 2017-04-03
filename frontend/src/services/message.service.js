define(['toastr'], function (toastr) {
	angular.module('message', [])
		.factory('message-service', [function(){
			function message (config) {
				config = config || {};
				var options = {
					"type": "success",
					"text": "text",
				  	"closeButton": true,
				  	"debug": false,
				  	"newestOnTop": false,
				  	"progressBar": true,
				  	"positionClass": "toast-top-center",
				  	"preventDuplicates": false,
				  	"showDuration": "300",
				  	"hideDuration": "1000",
				  	"timeOut": "1000",
				  	"showEasing": "swing",
				  	"hideEasing": "linear",
				  	"showMethod": "fadeIn",
				  	"hideMethod": "fadeOut"
				};
				toastr.options = $.extend(options, config);
				return toastr[options.type](options.text);
			}
			return message;
		}])
});