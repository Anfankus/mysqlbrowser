'use strict';
function CreateType(){
    this.types= ['','database', 'table', 'data'];
    this.current= 1;
    this.previousName=[''];
    this.next=function (current) {
        if (this.current === 3) {
            return undefined;
        }
        this.previousName.push(current);
        ++this.current;
        return this
    };
    this.previous=function(){
      if(this.current<=1){
          return undefined;
      }
      --this.current;
      this.previousName.pop();
      return this.previousName[this.current-1];
    };
}
function updateTable(html,type) {
    $('tbody,thead').remove();
    $('.tb').append(html);
    bindTableClick(type);
}

function bindTableClick(type){
    if (type.current === 3)
        return;
    let tds = $('td');
    for (let i = 0; i < tds.length; i++) {
        tds[i].onclick = function () {
            let innername = this.innerText;
            $.ajax('/home/query', {
                method: 'post',
                data: {
                    type: type.types[type.current],
                    name: innername
                }
            }).done(function (_data) {
                let data = JSON.parse(_data);
                switch (data.status) {
                    case 0:
                        updateTable(data.data,type.next(innername));
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
                }

            }).fail(function (xhr, status) {
                console.log(`${xhr}----${status}`);
                alert('连接服务器失败');
            })
        }
    }

}

$(function () {
    let type=new CreateType();

    bindTableClick(type);

    let btnl=$('#logout');
    let btnp=$('#previous');
    btnp.click(function(){
        let outerName=type.previous();
        if(outerName===undefined)
            return;
        $.ajax('/home/query',{
            method: 'post',
            data: {
                type: type.types[type.current-1],
                name: outerName
            }
        }).done(function (_data) {
            let data = JSON.parse(_data);
            switch (data.status) {
                case 0:
                    updateTable(data.data,type);
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
            }

        }).fail(function (xhr, status) {
            console.log(`${xhr}----${status}`);
            alert('连接服务器失败');
        })

    });
    btnl.click(function(){
        $.ajax('/home/logout',{
            method:'get'
        }).done(function(data){
            location.href='/login';
        })
    })
});