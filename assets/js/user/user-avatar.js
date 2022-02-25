$(function () {
    // 获取裁剪区dom元素
    var $image = $('#Image');
    const options = {
        aspectRatio: 1,
        preview: '.img-preview'
    }
    $image.cropper(options);

    // 选择图片
    $('#chooseImageBtn').on('click', function () {
        $('#file').click();
    });
    // 更换图片
    $('#file').on('change', function (e) {
        var fileList = e.target.files;
        if (fileList.length === 0) {
            return layui.layer.msg('请选择上传的图片！');
        }

        // 拿到选择的图片
        var file = e.target.files[0];
        // 将图片转化为路径
        var newImgURL = URL.createObjectURL(file);
        // 重新初始化裁剪区
        $image.cropper('destory').cropper('replace', newImgURL);

    });

    $('#uploadImageBtn').on('click', function () {
        var dataURL = $image.cropper("getCroppedCanvas", {
            width: 90,
            height: 90
        }).toDataURL('image / png');

        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg(res.message);
                window.parent.getUserInfo();
            }
        });
    });


});