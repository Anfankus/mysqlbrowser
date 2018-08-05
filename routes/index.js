'use strict';

const express = require('express');
const router = express.Router();
const mysql = require('mysql');


router.get('/', function (req, res, next) {
    res.render('index.pug', {title: 'Mysql browser'});
});
router.post('/', function (req, res) {

    console.log(`------------${req.body.username}-------${req.body.password}------------`);
    let config={
        host: 'localhost',
        user: req.body.username,
        password:req.body.password
    };
    let connection = mysql.createConnection(config);
    connection.connect(function (err) {
        if (err) {
            console.log(`error connecting ${err.stack}`);

            res.end(JSON.stringify({status:false,info:'log in failed'}));
            return;
        }
        console.log(`connected as id ${connection.threadId}`);
        connection.end();
        req.session.conf=config;
        res.redirect('../home');
    });
    //connection.end();
});

module.exports = router;
