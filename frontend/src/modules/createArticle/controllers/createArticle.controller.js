define(['markdownService','marked'], function (markdownService,marked) {
    var deps = [];
    var createArticleModel = angular.module('createArticle', deps);
    createArticleModel.controller('createArticle.ctrl', ['$rootScope', '$scope', '$cookies', '$state', 'http', function($rootScope, $scope, $cookies, $state, http){
        $(function () {
            // 初始化编辑器
            var editor = markdownService({
                ele: $('#editor')[0],
                publish: createArticle
            });  
            /**
             * @name 文档的内容改为摘要，去除不必要的md标记
             * @param content <string> 查询出来的article文档
             * @param length <number> 截取的摘要长度，默认250
             * @return string  转换完毕的内容摘要
             * */
            function getAbstract(content, length) {
                var _length = length || 150;
                var _abstractArr = marked.lexer(content);
                var _abstract = '';
                var _fragment_text;
                var _fragment;
                for (var prop in _abstractArr) {
                    _fragment = _abstractArr[prop];
                    _fragment_text = _fragment.text;
                    if (!!_fragment_text && _fragment.type === 'paragraph') {
                        if (_abstract.length < _length) {
                            // 去除markdown的标记符号
                            _abstract += _fragment_text.replace(/(\*+)|(_+)|(\!\[.+\))|(\n)|(\[.+?\]\(.+?\))|(\n)|(\")|(\[.+?\]\[.+?\])|(\`+)/g, '');
                        } else {
                            break;
                        }
                    }
                }
                _abstract += '...';
                return _abstract;
            }

            $scope.newArticle = {};
            function createArticle () {
                var content = editor.value();
                if(!$scope.newArticle.title || $scope.newArticle.title.trim() === ''){
                    return alert('请输入文章标题');
                }
                if(content.trim() === ''){
                    return alert('请输入文章内容');
                }
                if(!$scope.newArticle.tags || $scope.newArticle.tags.trim() === ''){
                    return alert('请输入文章标签');
                }
                var len = Math.floor(Math.random() * 100 + 50);
                var abstract = getAbstract(content, len);
                var avatar = marked(content).match(/<img\s+src=.*>/);
                avatar = avatar ? $(avatar[0]).attr('src') : 'http://localhost:3000/asset/defaultArticleAvatar.jpg';
            	http.request({
            		method: 'POST',
            		url: '/user/article',
            		data: {
            			token: $cookies.get('TOKEN'),
            			title: $scope.newArticle.title,
            			content: content,
                        abstract: abstract,
            			tags: $scope.newArticle.tags,
                        avatar: avatar
            		}
            	}).then(function (res) {
            		if(res.data.result){
                        $scope.newArticle.title = '';
                        $scope.newArticle.tags = '';
                        editor.value('');
            			$state.go('user', {username: $rootScope.userInfo.username});
            		}
            	});
            };
            // 修改编辑器的高度，让他全屏显示
            $('.editor_wrap').height($(window).height() - 160 + 'px');
            $('body').resize(function () {
                $('.editor_wrap').height($(window).height() - 160 + 'px');
            });
            // 选择插入图片的方式
            $('.insertImgType').click(function () {
                if($('#remoteUrl').css('display') === 'none'){
                    $('#file, #file+button').val('').hide();
                    $('#remoteUrl').show();
                    $('.insertImgType').text('或上传本地图片');
                    $('#upload').show();
                }else{
                    $('#file, #file+button').show();
                    $('#remoteUrl').val('').hide();
                    $('.insertImgType').text('或选择网络图片');
                    $('#upload').hide();
                }
            });
            // 选择本地图片
            $('#file+button').click(function () {
                $('#file').click();
            });
            // 关闭模态框，接触绑定的change click事件
            $('#insertImg').on('hidden.bs.modal', function (e) {
                $('#file').unbind('change');
                $('#upload').unbind('click');
            });
        });
    }]);
    return createArticleModel;
});