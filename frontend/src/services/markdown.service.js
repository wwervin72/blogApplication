define(['highlight','simplemde'], function (highlight,simplemde) {
    function markdown (config) {
        var editor = new simplemde({
            lang: 'zh-cn',
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
                'horizontal-rule'
            ],
            hideIcons: ['guide'],
            callback: function (argument) {
                config.cb && config.cb();
            }
        });
        var ele = $(editor.element);
        ele.siblings('.CodeMirror').css({
            'height': 'calc(100% - 160px)',
            'box-sizing': 'border-box'
        })
        ele.siblings('.editor-statusbar').remove();
        return editor;
    }
    return markdown;
})