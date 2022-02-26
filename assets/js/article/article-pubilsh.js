$(function () {
    //初始化分类
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

    // 初始化富文本编辑器
    tinymce.init({
        selector: '#article-content',
        language: 'zh_CN',
        min_height: 400,
        menubar: false, //菜单栏
        branding: false, //右下角技术支持
    });

    // // 获取裁剪区dom元素
    // var $image = $('#Image');
    // const options = {
    //     aspectRatio: 4 / 3,
    //     preview: '.img-preview'
    // }
    // $image.cropper(options);

    // 更换图片
    // $('#coverfile').on('change', function (e) {
    //     var files = e.target.files;
    //     if (files.length === 0) {
    //         return layui.layer.msg('请选择上传的图片！');
    //     }
    //     // 将图片转化为路径
    //     var newImgURL = URL.createObjectURL(files[0]);
    //     // 重新初始化裁剪区
    //     $image.cropper('destory').cropper('replace', newImgURL);

    // });

    // 定义文章发布状态
    var articleState = '已发布';
    // 用户点击草稿时，修改文章状态
    $('.sketch-btn').on('click', function () {
        articleState = '草稿';
    });

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
        console.log(file);
    })

    // 给表单绑定submit事件
    $('#article-publish').on('submit', function (e) {
        e.preventDefault();
        if (!file) return layui.layer.msg('请选择文章封面！');

        // 基于form表单创建FormData对象
        var fd = new FormData($(this)[0]);

        // 追加state到fd中
        fd.append('state', articleState);

        fd.append('cover_img', file);

        // 发起ajax请求将数据传入服务端
        publishArticle(fd);
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