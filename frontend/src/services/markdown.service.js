define(['bootstrap','simplemde'], function (bootstrap,simplemde) {
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
                    className: 'fa fa-bold',
                    title: '粗体'
                },
                {
                    name: 'italic',
                    action: simplemde.toggleItalic,
                    className: 'fa fa-italic',
                    title: '斜体'
                },
                {
                    name: 'strikethrough',
                    action: simplemde.toggleStrikethrough,
                    className: 'fa fa-strikethrough',
                    title: '删除线'
                },
                {
                    name: 'heading',
                    action: simplemde.toggleHeadingSmaller,
                    className: 'fa fa-header',
                    title: '标题'
                },
                {
                    name: 'code',
                    action: simplemde.toggleCodeBlock,
                    className: 'fa fa-code',
                    title: '代码'
                },
                {
                    name: 'quote',
                    action: simplemde.toggleBlockquote,
                    className: 'fa fa-quote-left',
                    title: '引用'
                },
                {
                    name: 'unordered-list',
                    action: simplemde.toggleUnorderedList,
                    className: 'fa fa-list-ul',
                    title: '无序列表'
                },
                {
                    name: 'ordered-list',
                    action: simplemde.toggleOrderedList,
                    className: 'fa fa-list-ol',
                    title: '有序列表'
                },
                {
                    name: 'link',
                    action: simplemde.drawLink,
                    className: 'fa fa-link',
                    title: '插入链接'
                },
                {
                    name: 'image',
                    action: function (e) {
                        $('#upload').bind('click',function () {
                            var val = $('#remoteUrl').val();
                            if(val === ''){
                                alert("请选择上传本地图片或者输入网络图片链接");
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
                    className: 'fa fa-picture-o',
                    title: '插入图片'
                },
                {
                    name: 'table',
                    action: simplemde.drawTable,
                    className: 'fa fa-table',
                    title: '插入表格'
                },
                {
                    name: 'horizontal-rule',
                    action: simplemde.drawHorizontalRule,
                    className: 'fa fa-minus',
                    title: '水平分割线'
                },
                {
                    name: 'preview',
                    action: simplemde.togglePreview,
                    className: 'fa fa-eye no-disable',
                    title: '阅读模式'
                },
                {
                    name: 'side-by-side',
                    action: simplemde.toggleSideBySide,
                    className: 'fa fa-columns no-disable no-mobile',
                    title: '并排显示'
                },
                {
                    name: 'fullscreen',
                    action: simplemde.toggleFullScreen,
                    className: 'fa fa-arrows-alt no-disable no-mobile',
                    title: '全屏'
                },
                {
                    name: 'publish',
                    action: function (e) {
                        config.publish && config.publish();
                    },
                    className: 'fa fa-publish',
                    title: '发布文章'
                }
            ]
        });
        var ele = $(editor.element);
        ele.siblings('.editor-statusbar').remove();
        // ele.find('+.editor-toolbar').append($('<a tabindex="-1" class="fa fa-arrows-alt no-disable no-mobile" data-original-title="发布文章">发布文章</a>'));
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