// define([], function () {
//     var deps = [];
//     var editorModel = angular.module('editor', deps);
//     editorModel.controller('editor.ctrl', ['$scope', function($scope){

//     }]);
//     editorModel.directive('contenteditable', function () {
//         return {
//             restrict: 'EA',
//             require: 'ngModel',
//             scope: {
//                 // model: '=ngModel',
//                 // menus: '=editorMenu'
//             },
//             link: function (scope, ele, attr, ctrl) {
//                 //创建编辑器
//                 var editor = new wangEditor(ele);
//                 wangEditor.config.printLog = false;
//                 editor.config.menus = attr.editorMenus.split(',');
//                 editor.config.emotions = {
//                     'default': {
//                         title: '默认',
//                         data: '../data/emotions.data'
//                     },
//                     'weibo': {
//                         title: '微博表情',
//                         data: [
//                             {
//                                 icon: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7a/shenshou_thumb.gif',
//                                 value: '[草泥马]'    
//                             },
//                             {
//                                 icon: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/60/horse2_thumb.gif',
//                                 value: '[神马]'    
//                             },
//                             {
//                                 icon: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/bc/fuyun_thumb.gif',
//                                 value: '[浮云]'    
//                             },
//                             {
//                                 icon: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c9/geili_thumb.gif',
//                                 value: '[给力]'    
//                             },
//                             {
//                                 icon: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f2/wg_thumb.gif',
//                                 value: '[围观]'    
//                             },
//                             {
//                                 icon: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/70/vw_thumb.gif',
//                                 value: '[威武]'
//                             }
//                         ]
//                     }
//                 };
//                 editor.onchange = function () {
//                     scope.$apply(function () {
//                         ctrl.$setViewValue(editor.$txt.html());
//                     });
//                 };
//                 editor.create();
//             }
//         }
//     });

//     return editorModel;
// });