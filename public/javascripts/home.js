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
        if(type_str==='data')
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
                }).done(function(data){
                  updateTable(data,type.next());
                }).fail(function (xhr, status) {

                })
            }
        }

    }

    bindClick(type.types[type.current]);
});