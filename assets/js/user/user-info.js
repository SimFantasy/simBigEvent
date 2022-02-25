$(function () {
    // 给昵称添加验证
    layui.form.verify({
        nickname: [
            /^[\u4E00-\u9FA5A-Za-z_]{1,10}$/,
            '昵称必须中、英文大小写、数字、下划线1-10个字符。'
        ]
    });

    // 初始化用户信息
    initUserInfo();

    // 初始化用户信息函数
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                // 通过layui的方法给表单赋值
                layui.form.val('formUserInfo', res.data);
            }
        });
    }

    // 重置表单数据
    $('#resetBtn').on('click', function (e) {
        e.preventDefault();
        // 重新初始化信息 layui.form.val()会重新获取初始信息赋值给表单
        initUserInfo();
    });

    // 更新用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg(res.message);
                // 更新index页面用户信息
                window.parent.getUserInfo();
            }
        });
    });

});