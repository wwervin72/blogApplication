define([
        "editormd", 
        "libs/editor.md/languages/en", 
        "libs/editor.md/plugins/link-dialog/link-dialog",
        "libs/editor.md/plugins/reference-link-dialog/reference-link-dialog",
        "libs/editor.md/plugins/image-dialog/image-dialog",
        "libs/editor.md/plugins/code-block-dialog/code-block-dialog",
        "libs/editor.md/plugins/table-dialog/table-dialog",
        "libs/editor.md/plugins/emoji-dialog/emoji-dialog",
        "libs/editor.md/plugins/goto-line-dialog/goto-line-dialog",
        "libs/editor.md/plugins/help-dialog/help-dialog",
        "libs/editor.md/plugins/html-entities-dialog/html-entities-dialog", 
        "libs/editor.md/plugins/preformatted-text-dialog/preformatted-text-dialog"
    ], function (editormd) {
        editormd.loadCSS("libs/editor.md/lib/codemirror/addon/fold/foldgutter");
        function markdown (argument) {
            console.log($('#test-editormd'))
            testEditor = editormd("test-editormd", {
                        width: "90%",
                        height: 640,
                        path : '',
                        markdown : '',
                        // codeFold : true,
                        // searchReplace : true,
                        // saveHTMLToTextarea : true,                // 保存HTML到Textarea
                        // htmlDecode : "style,script,iframe|on*",       // 开启HTML标签解析，为了安全性，默认不开启    
                        // emoji : true,
                        // taskList : true,
                        // tex : true,
                        // tocm            : true,         // Using [TOCM]
                        // autoLoadModules : false,
                        // previewCodeHighlight : true,
                        // flowChart : true,
                        // sequenceDiagram : true,
                        // //dialogLockScreen : false,   // 设置弹出层对话框不锁屏，全局通用，默认为true
                        // //dialogShowMask : false,     // 设置弹出层对话框显示透明遮罩层，全局通用，默认为true
                        // //dialogDraggable : false,    // 设置弹出层对话框不可拖动，全局通用，默认为true
                        // //dialogMaskOpacity : 0.4,    // 设置透明遮罩层的透明度，全局通用，默认值为0.1
                        // //dialogMaskBgColor : "#000", // 设置透明遮罩层的背景颜色，全局通用，默认为#fff
                        // imageUpload : true,
                        // imageFormats : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
                        // imageUploadURL : "./php/upload.php",
                        // onload : function() {
                        //     console.log('onload', this);
                        //     //this.fullscreen();
                        //     //this.unwatch();
                        //     //this.watch().fullscreen();

                        //     //this.setMarkdown("#PHP");
                        //     //this.width("100%");
                        //     //this.height(480);
                        //     //this.resize("100%", 640);
                        // }
                    });
            testEditor.show();
            testEditor.showToolbar();
        }
        return {markdown: markdown};
});