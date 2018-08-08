'use strict';
$(function () {
    let btn = $('#btn1');
    let username_input = $('input[type="text"]');
    let passwd_input = $('input[type="password"]');
    let tip=$('.tips');

    function clearTip(){
        if(tip.text()){
            tip.text('')
        }
    }
    username_input.focus(clearTip);
    passwd_input.focus(clearTip);

    btn.click(function () {

        let username = username_input.val();
        let passwd = passwd_input.val();

        $.ajax("/login", {
            method: 'post',
            data: {username: username, password: passwd}
        }).done(function (data) {
            if (data === '') {
                tip.text('登陆错误');
            }
            else {
                location.href = 'home';
            }
        }).fail(function (xhr, status) {
            tip.text("连接到服务器失败");
        })

    })

});