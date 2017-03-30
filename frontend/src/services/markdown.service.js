define(['bootstrap','simplemde'], function (bootstrap,simplemde) {
    function markdown (config) {
        var toolbarTitle = [
            {
                oT: 'Bold (Ctrl-B)',
                nT: '粗体 (Ctrl-B)'
            },
            {
                oT: 'Italic (Ctrl-I)',
                nT: '斜体 (Ctrl-I)'
            },
            {
                oT: 'Strikethrough',
                nT: '删除线'
            },
            {
                oT: 'Heading (Ctrl-H)',
                nT: '标题 (Ctrl-H)'
            },
            {
                oT: 'Code (Ctrl-Alt-C)',
                nT: '代码 (Ctrl-Alt-C)'
            },
            {
                oT: 'Quote (Ctrl-\')',
                nT: '粗体 (Ctrl-B)'
            },
            {
                oT: 'Generic List (Ctrl-L)',
                nT: '无序列表 (Ctrl-B)'
            },
            {
                oT: 'Numbered List (Ctrl-Alt-L)',
                nT: '有序列表 (Ctrl-B)'
            },
            {
                oT: 'Create Link (Ctrl-K)',
                nT: '插入链接 (Ctrl-B)'
            },
            {
                oT: 'Insert Table',
                nT: '插入表格'
            },
            {
                oT: 'Insert Image (Ctrl-Alt-I)',
                nT: '插入图片 (Ctrl-B)'
            },
            {
                oT: 'Insert Horizontal Line',
                nT: '水平分割线'
            },
            {
                oT: 'Toggle Preview (Ctrl-P)',
                nT: '阅读模式 (Ctrl-P)'
            },
            {
                oT: 'Toggle Side by Side (F9)',
                nT: '并排显示 (F9)'
            },
            {
                oT: 'Toggle Fullscreen (F11)',
                nT: '全屏 (F11)'
            }
        ]
        var editor = new simplemde({
            element: config.ele,
            autofocus: true,
            placeholder: '来写点什么吧...',
            tabSize: 4,
            showIcons: [
                'code', 
                'table', 
                'strikethrough',
                '|', 
                'unordered-list', 
                'ordered-list', 
                'horizontal-rule',
                'publish'
            ],
            hideIcons: ['guide']
        });
        var ele = $(editor.element);
        ele.siblings('.editor-statusbar').remove();
        // toolbar tips
        ele.find('+.editor-toolbar > a').each(function (index, item) {
            item = $(item);
            toolbarTitle.forEach(function (element) {
                if(element.oT === item.attr("title")){
                    item.attr("title", element.nT)
                    item.tooltip()
                }
            })
            item.removeAttr('title');
        });
        return editor;
    }
    return markdown;
})