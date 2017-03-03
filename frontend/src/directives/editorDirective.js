define([], function () {
    var deps = [];
    var editorModel = angular.module('editor', deps);
    editorModel.controller('editor.ctrl', ['$scope', function($scope){

    }]);
    editorModel.directive('contenteditable', function () {
        return {
            restrict: 'EA',
            require: 'ngModel',
            link: function (scope, ele, attr, ctrl) {
                //创建编辑器
                var editor = new wangEditor(ele);
                wangEditor.config.printLog = false;
                editor.config.menus = [
                    'source',
                    '|',
                    'bold',
                    'underline',
                    'italic',
                    'strikethrough',
                    'eraser',
                    'forecolor',
                    'bgcolor',
                    '|',
                    'quote',
                    'fontfamily',
                    'fontsize',
                    'head',
                    'unorderlist',
                    'orderlist',
                    'alignleft',
                    'aligncenter',
                    'alignright',
                    '|',
                    'link',
                    'unlink',
                    'table',
                    'emotion',
                    '|',
                    'img',
                    // 'video',
                    // 'location',
                    'insertcode',
                    '|',
                    'undo',
                    'redo',
                    'fullscreen'
                ];
                editor.onchange = function () {
                    scope.$apply(function () {
                        ctrl.$setViewValue(editor.$txt.html());
                    });
                };
                editor.create();
            }
        }
    });
    return editorModel;
});