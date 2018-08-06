'use strict';
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const pug=require('pug');

let TransData=require('./index').TransData;
/*
    查询结果结构转变为关键字数组和数据数组
 */
function result2data(keys,values,results){
    let flag=true;
    for(let i of results){
        let temp=[];
        for(let j in i) {
            if(flag) keys.push(j);
            temp.push(i[j]);
        }
        flag=false;
        values.push(temp);
    }

}

let conn;
const compiledTable=pug.compileFile('views/table.pug');

router.get('/',function(req,res,next){
    let config=req.session.conf;
    if(config) {
        if(!conn){
            conn=mysql.createConnection(config);
        }
        conn.query('show databases;', function (error, results, fields) {
            if(error) {
                //connection.end();
                console.log('sql 错误');
                res.end('');
                return;
            }
            let Keys=[];
            let Values=[];
            result2data(Keys,Values,results);
            res.render('home.pug',{keys:Keys,values:Values});
        });
    }
    else{
        if(conn) {
            conn.end();
        }
        res.redirect('../login');
    }
});
router.post('/',function(req,res){
    if(req.session.conf&&conn){
        let type=req.body.type;
        let name=req.body.name;
        let sqlState;
        switch (type){
            case 'database':
                conn.query(`use ${name};`);
                sqlState='show tables;';
                break;
            case 'table':
                sqlState=`select * from ${name}`;
                break;
            default:
                console.log('查询信息错误');
                res.end(JSON.stringify(new TransData(2)));
                return;
        }
        conn.query(sqlState,function(err,result,field){
            if(err){
                if(err.errno===1356){
                    console.log('####-----------用户访问权限不足------------######');
                    res.end(JSON.stringify(new TransData(4)));
                }
                else {
                    console.log("sql 错误");
                    res.end(JSON.stringify(new TransData(2)));
                }
                return ;
            }
            let Keys=[];
            let Values=[];
            result2data(Keys,Values,result);
            res.end(
                JSON.stringify(
                    new TransData(
                        0,compiledTable({
                            keys:Keys,
                            values:Values
            }))));
        })
    }//if(req.session.conf&&conn)
    else{
        res.end(JSON.stringify(new TransData(3)));
    }
});
module.exports=router;