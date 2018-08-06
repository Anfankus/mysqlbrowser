'use strict';
let type = {
    types: ['database', 'table', 'data'],
    current: 0,
    next: function () {
        if (this.current === 2) {
            return undefined;
        }
        return this.types[++this.current];
    }
};
$(function () {
    function updateTable(html, type_str) {
        $('tbody').remove();
        $('.tb').append(html);
        bindClick(type_str);
    }

    function bindClick(type_str) {
        if (type_str === 'data')
            return;
        let tds = $('td');
        for (let i = 0; i < tds.length; i++) {
            tds[i].onclick = function () {
                let innername = this.innerText;
                $.ajax('/home', {
                    method: 'post',
                    data: {
                        type: type_str,
                        name: innername
                    }
                }).done(function (_data) {
                    let data = JSON.parse(_data);
                    switch (data.status) {
                        case 0:
                            updateTable(data.data, type.next());
                            break;
                        case 1:
                            alert('页面错误');
                            break;
                        case 2:
                            alert('查询错误');
                            break;
                        case 3:
                            alert('登录失效，请重新登陆');
                            location.href = '/login';
                            break;
                        case 4:
                            alert('没有权限访问');
                            break;
                        case 5:
                            alert('登陆错误');
                            break;
                    }

                }).fail(function (xhr, status) {
                    console.log(`${xhr}----${status}`);
                    alert('连接服务器失败');
                })
            }
        }

    }

    bindClick(type.types[type.current]);
});