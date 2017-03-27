define([
        "editormdConfit"
    ], function (config) {
        var promise = new Promise(function (resolve, reject) {
            require([
                "editormd",
                "../languages/en", 
                "../plugins/link-dialog/link-dialog",
                "../plugins/reference-link-dialog/reference-link-dialog",
                "../plugins/image-dialog/image-dialog",
                "../plugins/code-block-dialog/code-block-dialog",
                "../plugins/table-dialog/table-dialog",
                "../plugins/emoji-dialog/emoji-dialog",
                "../plugins/goto-line-dialog/goto-line-dialog",
                "../plugins/help-dialog/help-dialog",
                "../plugins/html-entities-dialog/html-entities-dialog", 
                "../plugins/preformatted-text-dialog/preformatted-text-dialog"
                ], function (editormd) {
                    // editormd.loadCSS("libs/editor.md/lib/codemirror/addon/fold/foldgutter");
                    function markdown (config) {
                        testEditor = editormd(config.area, {
                                width: "100%",
                                height: 640,
                                path : 'libs/editor.md/lib/',
                                markdown : '',
                                codeFold : true,
                                searchReplace : true,
                                saveHTMLToTextarea : true,                // 保存HTML到Textarea
                                htmlDecode : "style,script,iframe|on*",       // 开启HTML标签解析，为了安全性，默认不开启    
                                emoji : true,
                                taskList : true,
                                tex : true,
                                tocm            : true,         // Using [TOCM]
                                autoLoadModules : false,
                                previewCodeHighlight : true,
                                flowChart : true,
                                sequenceDiagram : true,
                                //dialogLockScreen : false,   // 设置弹出层对话框不锁屏，全局通用，默认为true
                                //dialogShowMask : false,     // 设置弹出层对话框显示透明遮罩层，全局通用，默认为true
                                //dialogDraggable : false,    // 设置弹出层对话框不可拖动，全局通用，默认为true
                                //dialogMaskOpacity : 0.4,    // 设置透明遮罩层的透明度，全局通用，默认值为0.1
                                //dialogMaskBgColor : "#000", // 设置透明遮罩层的背景颜色，全局通用，默认为#fff
                                imageUpload : true,
                                imageFormats : ["jpg", "jpeg", "gif", "png"],
                                imageUploadURL : "./php/upload.php",
                                onload : function() {
                                    console.log('onload', this);
                                    //this.fullscreen();
                                    //this.unwatch();
                                    //this.watch().fullscreen();

                                    //this.setMarkdown("#PHP");
                                    //this.width("100%");
                                    //this.height(480);
                                    //this.resize("100%", 640);
                                }
                            });
                        testEditor.show();
                        testEditor.showToolbar();
                    }
                    resolve(markdown)
            });
        });
        return promise;
});