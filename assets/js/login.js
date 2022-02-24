$(function () {
    // 点击去注册链接
    $('#link-reg').on('click', function () {
        $('.login-group').hide();
        $('.reg-group').show();
    });
    // 点击去登录链接
    $('#link-login').on('click', function () {
        $('.reg-group').hide();
        $('.login-group').show();
    });
    // 自定义表单验证规则
    layui.form.verify({
        uname: [/^[a-zA-Z0-9]{3,10}$/, '用户名必须是3-10位字母和数字'],
        pwd: [/^\S{6,15}$/, '密码长度必须是6-15位的非空字符串'],
        repwd: function (value) {
            if (value !== $('.reg-group [name="password"]').val()) {
                return '两次密码不一致！';
            }
        }
    })

    // 用户注册
    $('.reg-group').on('submit', function (e) {
        //阻止表单默认提交行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-group [name=username]').val(),
                password: $('.reg-group [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }

                layui.layer.msg('注册成功，请登录！');
                $('.reg-group .form-link').click();
            }
        });
    });

    // 用户登录
    $('.login-group').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layui.layer.msg('登录失败~');
                } else {
                    layui.layer.msg('登录成功！');
                    localStorage.setItem('token', res.token);
                    location.href = '/index.html';
                };
            }
        });
    });
});
