define(['jquery', 'angular'], function ($, angular) {
	angular.module('carousel.template', []).run(['$templateCache', function ($templateCache) {
		$templateCache.put("carousel.template.url",[
				'<div class="ws-carousel" style="width: {{width}}px;height: {{height}}px;">',
					'<div class="ws-carousel-leafs" style="width: {{width * (list.length+2)}}px;height: {{height}}px;margin-left: {{-width}}px">',
						'<div class="leaf" ng-bind-html="list[list.length - 1].html" style="width: {{width}}px;height: {{height}}px;">',
						'</div>',
						'<div class="leaf" ng-repeat="li in list" ng-bind-html="li.html" style="width: {{width}}px;height: {{height}}px;">',
						'</div>',
						'<div class="leaf" ng-bind-html="list[0].html" style="width: {{width}}px;height: {{height}}px;">',
						'</div>',
					'</div>',
					'<ul class="ws-carousel-btns">',
						'<li ng-repeat="btn in list"><button></button></li>',
					'</ul>',	
					'<a href="javascript:;" class="prev"></a>',
					'<a href="javascript:;" class="next"></a>',
				'</div>'
			].join(''))
	}])
	var carousel = angular.module('carousel', ['carousel.template']);
	carousel.directive('wsCarousel', function () {
		return {
			restrict: 'AE',
			replace: true,
			transclude: false,
			scope: {
				list: '=',
				width: '=',
				height: '='
			},
			templateUrl: 'carousel.template.url',
			link: function (scope, ele, attr) {
				var len = scope.list.length,
					aniFinish = true,
					current = 0,
					leafs = $('.ws-carousel-leafs'),
					space = Number(attr['space']),
					space = isNaN(space) ? 3000 : space,
					btns,
					carouselTimer,
					w,
					h;
				var timer = setInterval(function () {
					if($('.leaf').length){
						w = parseInt($(ele).css('width'));
						h = parseInt($(ele).css('height'));
						timer = clearInterval(timer);
						btns = $('.ws-carousel-btns > li');
						btns.eq(current).addClass('active');
						btns.hover(function () {
							if(!aniFinish){
								return;
							}
							var index = $(this).index();
							if(current === index){
								return;
							}
							carouselTimer = clearInterval(carouselTimer);
							if(index > current){
								left(index - current);
							}else if(index < current){
								right(current - index);
							}
						});
						$('.prev').click(function () {
							if(!aniFinish){
								return;
							}
							carouselTimer = clearInterval(carouselTimer);
							right();
						});
						$('.next').click(function () {
							if(!aniFinish){
								return;
							}
							carouselTimer = clearInterval(carouselTimer);
							left();
						});
					}
				}, 10);
				// 左运动
				function left (num) {
					num = num ? num : 1;
					if(!aniFinish){
						return;
					}
					aniFinish = false;
					leafs.animate({
						marginLeft: parseInt(leafs.css('margin-left')) - w * num + 'px'
					}, attr['speed'], function () {
						current = (current + num) % len;
						if(leafs.css('margin-left') === '-' + (len + 1) * w + 'px'){
							current = 0;
							leafs.css('margin-left', '-' + w + 'px');
						}
						btns.removeClass('active');
						btns.eq(current).addClass('active');
						aniFinish = true;
						if(!carouselTimer){
							carouselTimer = setInterval(left, space)
						}
					});
				}
				// 右运动
				function right (num) {
					num = num ? num : 1;
					if(!aniFinish){
						return;
					}
					aniFinish = false;
					leafs.animate({
						marginLeft: parseInt(leafs.css('margin-left')) + w * num + 'px'
					}, attr['speed'], function () {
						current = (current - num) % len;
						if(leafs.css('margin-left') === '0px'){
							current = len - 1;
							leafs.css('margin-left', '-' + w * len + 'px');
						}
						btns.removeClass('active');
						btns.eq(current).addClass('active');
						aniFinish = true;
						if(!carouselTimer){
							carouselTimer = setInterval(right, space)
						}
					});
				}
			}
		}
	});
	return carousel;
});