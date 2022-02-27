$(function () {
    // 定义请求参数
    var q = {
        pagenum: 1, // 页码值，默认第一页
        pagesize: 2, // 每页显示几条数据
        cate_id: '', // 分类ID
        state: '' // 文章状态
    }
    // 初始化文章列表数据
    initArticleList();
    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                };
                var tplStr = template('tpl-articleList', res);
                $('.layui-table tbody').html(tplStr);
                renderPage(res.total);
            }

        });
    }

    // 时间格式过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        // 新建一个date实例
        var df = new Date(dtStr);
        // 获取年月日，给月、日补0
        var y = df.getFullYear();
        var m = comp(df.getMonth() + 1);
        var d = comp(df.getDate());
        // 获取时分秒，并补0
        var hh = comp(df.getHours());
        var mm = comp(df.getMinutes());
        var ss = comp(df.getSeconds());
        // 返回格式化的时间
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;

    }

    // 时间补0函数
    function comp(num) {
        // 小于0的补上0
        num = num < 10 ? '0' + num : num;
        return num;
    }

    // 初始化分类查询
    initCategory();
    function initCategory() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                };
                var tplcateStr = template('tpl-category', res);
                $('[name=cate_id]').html(tplcateStr);
                // 通过layui重新渲染下拉列表
                layui.form.render();
            }
        });
    }

    // 监听查询submit事件
    $('#search-form').on('submit', function () {
        q.cate_id = $('[name=cate_id]').val();
        q.state = $('[name=state_id]').val();
        initArticleList();
    });

    // 获取分页函数
    function renderPage(total) {
        layui.laypage.render({
            elem: 'page-group',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initArticleList();
                }
            }
        });
    }

    // 删除文章
    $('.layui-table tbody').on('click', '.del-article', function () {
        var id = $(this).attr('data-id');
        var len = $('.del-article').length;
        layer.confirm('确定是否删除该文章?', { icon: 3, title: '删除提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    layui.layer.msg(res.message);
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initArticleList();
                },
                error: function (res) {
                    layui.layer.msg(res.message);
                }
            });
            layer.close(index);
        });
    });

    // 发布文章
    var addArt = null;
    $('.add-article').on('click', function () {
        // 定义文章发布状态
        var articleState = '已发布';
        addArt = layui.layer.open({
            type: 1,
            title: '发布文章',
            area: ['960px', '640px'],
            content: $('#addArticle').html(),
            btn: ['发布文章', '草稿'],
            yes: function () {
                if (!file) return layui.layer.msg('请选择文章封面！');

                // 基于form表单创建FormData对象
                var fd = new FormData($('#addArticleForm')[0]);

                // 追加state到fd中
                fd.append('state', articleState);

                fd.append('cover_img', file);

                // 发起ajax请求将数据传入服务端
                publishArticle(fd);
            },
            btn2: function () {
                articleState = '草稿';
            }
        });

        // 初始化富文本编辑器
        tinymce.init({
            selector: '#article-content',
            language: 'zh_CN',
            min_height: 400,
            menubar: false, //菜单栏
            branding: false, //右下角技术支持
        });
        // 初始化分类
        initCategory();

        // 选择封面
        $('.btn-choose-img').on('click', function () {
            $('#file').click();
        });
        // 用户选择了封面
        var file = null
        $('#file').on('change', function (e) {
            const files = e.target.files;
            if (files.length === 0) {
                return file = null;
            }

            const imgURL = URL.createObjectURL(files[0]);
            $('#image').attr('src', imgURL);
            file = files[0];
        });
    });

    // 定义发布文章函数
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                };
                layui.layer.msg(res.message);
                setTimeout(function () {
                    location.href = '/article/article-list.html';
                }, 1000);
            }
        });
    }




});