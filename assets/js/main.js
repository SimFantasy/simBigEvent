// 每次发送ajax请求前会调用该函数，拿到对应api请求根路径
$.ajaxPrefilter(function (option) {
    option.url = 'http://www.liulongbin.top:3007' + option.url;
});