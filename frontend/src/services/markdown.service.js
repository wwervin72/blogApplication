define(['bootstrap','simplemde','toastr'], function (bootstrap,simplemde,toastr) {
    function markdown (config) {
        var editor = new simplemde({
            element: config.ele,
            autofocus: true,
            placeholder: '来写点什么吧...',
            tabSize: 4,
            blockStyles: {
                italic: '_'
            },
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
            hideIcons: ['guide'],
            toolbar: [
                {
                    name: 'bold',
                    action: simplemde.toggleBold,
                    // className: 'fa fa-bold',
                    className: 'fa ws_icon ws_icon_strong',
                    title: '粗体'
                },
                {
                    name: 'italic',
                    action: simplemde.toggleItalic,
                    className: 'fa ws_icon ws_icon_italic',
                    title: '斜体'
                },
                {
                    name: 'strikethrough',
                    action: simplemde.toggleStrikethrough,
                    className: 'fa ws_icon ws_icon_s',
                    title: '删除线'
                },
                {
                    name: 'heading',
                    action: simplemde.toggleHeadingSmaller,
                    className: 'fa ws_icon ws_icon_title',
                    title: '标题'
                },
                {
                    name: 'code',
                    action: simplemde.toggleCodeBlock,
                    className: 'fa ws_icon ws_icon_code',
                    title: '代码'
                },
                {
                    name: 'quote',
                    action: simplemde.toggleBlockquote,
                    className: 'fa ws_icon ws_icon_quote',
                    title: '引用'
                },
                {
                    name: 'unordered-list',
                    action: simplemde.toggleUnorderedList,
                    className: 'fa ws_icon ws_icon_ul',
                    title: '无序列表'
                },
                {
                    name: 'ordered-list',
                    action: simplemde.toggleOrderedList,
                    className: 'fa ws_icon ws_icon_ol',
                    title: '有序列表'
                },
                {
                    name: 'link',
                    action: simplemde.drawLink,
                    className: 'fa ws_icon ws_icon_link',
                    title: '插入链接'
                },
                {
                    name: 'image',
                    action: function (e) {
                        $('#upload').bind('click',function () {
                            var val = $('#remoteUrl').val();
                            if(val === ''){
                                toastr['info']('请选择上传本地图片或者输入网络图片链接');
                                return;
                            }
                            $('#remoteUrl').val('');
                            $('#upload').prev().click();
                            simplemde.drawImage(e, val);
                        });
                        $('#file').bind('change', function (evt) {
                            var event = evt || window.event;
                            var files = this.files || event.dataTransfer.files;
                            formData = new FormData();
                            formData.append('file', files[0]);
                            $.ajax({
                                type: 'POST',
                                url: 'http://localhost:3000/upload',
                                cache: false,
                                data: formData,
                                processData: false,
                                contentType: false
                            }).then(function (res) {
                                $('#file').val('');
                                $('#upload').prev().click();
                                simplemde.drawImage(e, res);
                            });
                        });
                    },
                    className: 'fa ws_icon ws_icon_img',
                    title: '插入图片'
                },
                {
                    name: 'table',
                    action: simplemde.drawTable,
                    className: 'fa ws_icon ws_icon_table',
                    title: '插入表格'
                },
                {
                    name: 'horizontal-rule',
                    action: simplemde.drawHorizontalRule,
                    className: 'fa ws_icon ws_icon_hr',
                    title: '水平分割线'
                },
                {
                    name: 'preview',
                    action: simplemde.togglePreview,
                    className: 'fa ws_icon ws_icon_read',
                    title: '阅读模式'
                },
                {
                    name: 'side-by-side',
                    action: simplemde.toggleSideBySide,
                    className: 'fa ws_icon_two ws_icon_cols',
                    title: '并排显示'
                },
                {
                    name: 'fullscreen',
                    action: simplemde.toggleFullScreen,
                    className: 'fa ws_icon_two ws_icon_fullscreen',
                    title: '全屏'
                },
                {
                    name: 'publish',
                    action: function (e) {
                        config.publish && config.publish();
                    },
                    className: 'fa ws_icon ws_icon_publish',
                    title: '发布文章'
                }
            ]
        });
        var ele = $(editor.element);
        ele.siblings('.editor-statusbar').remove();
        // toolbar tips
        ele.find('+.editor-toolbar > a').each(function (index, item) {
            item = $(item);
            if(item.attr("title") === '插入图片'){
                item.attr({
                    'data-toggle': 'modal',
                    'data-target': '#insertImg'
                })
            }
            item.tooltip()
            item.removeAttr('title');
        });
        return editor;
    }
    return markdown;
})