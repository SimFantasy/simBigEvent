$(function () {
    initCategoryList();
    // 初始化分类列表
    function initCategoryList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                var htmlStr = template('tpl-category', res);
                $('.layui-table tbody').html(htmlStr);
            }
        });
    }

    // 添加分类
    var addcate = null;
    $('#addCategoryBtn').on('click', function () {
        // 使用layui弹层
        addcate = layui.layer.open({
            type: 1,
            title: '添加分类',
            area: ['480px', '220px'],
            content: $('#addCategory').html()
        });
    });

    // 通过代理的方式给addCategoryForm绑定事件
    $('body').on('submit', '#addCategoryForm', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                return layui.layer.msg(res.message);
            }
        });
        initCategoryList();
        layui.layer.close(addcate);
    });

    // 编辑分类
    var editcate = null;
    $('.layui-table tbody').on('click', '.edit-category', function () {
        // 使用layui弹层
        editcate = layui.layer.open({
            type: 1,
            title: '编辑分类',
            area: ['480px', '220px'],
            content: $('#editCategory').html()
        });

        var editId = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + editId,
            success: function (res) {
                layui.form.val('editCategoryForm', res.data);
            }
        });
    });
    // 获取对应id的数据
    $('body').on('submit', '#editCategoryForm', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg(res.message);
            }
        });
        initCategoryList();
        layui.layer.close(editcate);
    });

    // 删除分类
    $('.layui-table tbody').on('click', '.del-category', function () {
        var delId = $(this).siblings().attr('data-id');

        layui.layer.confirm('是否确定删除？', { icon: 3, title: '删除提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + delId,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message);
                    };
                    layui.layer.msg(res.message);
                }
            });
            initCategoryList();
            layer.close(index);
        });
    });

});