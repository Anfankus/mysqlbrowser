'use strict';

const express = require('express');
const router = express.Router();
const mysql = require('mysql');

/*
    /==传输数据数据结构
    状态码：
    0--------操作成功
    1--------页面错误
    2--------查询错误
    3--------登陆失效
    4--------权限不足
    5--------登陆错误
 */
function TransData(status, infoORdata) {
    this.status = status;
    if (status===0) this.data = infoORdata;
}

router.get('/', function (req, res, next) {
    res.render('index.pug', {title: 'Mysql browser'});
});
router.post('/', function (req, res) {

    console.log(`用户登录: ${req.body.username} | ${req.body.password}------------`);
    let config = {
        host: 'localhost',
        user: req.body.username,
        password: req.body.password
    };
    let connection = mysql.createConnection(config);
    connection.connect(function (err) {
        if (err) {
            if (err.errno === 1251||err.errno===1045) {
                res.end(JSON.stringify(new TransData(5)));
            }
            return;
        }
        console.log(`connected as id ${connection.threadId}`);
        connection.end();
        req.session.conf = config;
        res.redirect('../home');
    });
    //connection.end();
});

module.exports = {
    Router: router,
    TransData: TransData
};
