// 每次发送ajax请求前会调用该函数
$.ajaxPrefilter(function (option) {
    // 拿到对应api请求根路径
    option.url = 'http://www.liulongbin.top:3007' + option.url;
    // 统一为有权限的接口设置 header 请求头,传递token
    if (option.url.indexOf('/my/') !== -1) {
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 统一加载ajax执行完成的函数
    // 执行完成后 最终调用的函数 complete
    option.complete = function (res) {
        // 如果身份认证失败，清除token并且跳回到登录
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token');
            location.href = '/login.html'; s
        }
    }

});