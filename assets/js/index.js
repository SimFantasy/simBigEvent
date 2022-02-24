$(function () {
    // 调用函数获取用户信息
    getUserInfo();
    // 退出
    $('#user-logout').on('click', function () {
        layui.layer.confirm('确定注销？', { icon: 3, title: '退出提示' }, function (index) {
            // 退出是清除localStorage中的token
            localStorage.removeItem('token');
            // 退出到首页
            location.href = '/login.html';
            // 关闭弹窗
            layer.close(index);
        });
    });
});

// 用户信息获取函数
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            // 渲染用户头像
            renderAvatar(res.data);
        }
    });
}

// 渲染用户头像函数
function renderAvatar(user) {
    // 获取用户名称，优先昵称
    var uname = user.nickname || user.username;
    $('#userinfo').html(uname);
    // 渲染用户头像 优先设置了头像的
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var firstWord = uname[0].toUpperCase();
        $('.text-avatar').html(firstWord).show();
    }
}