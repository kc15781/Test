"use strict";

const express = require('express');
const router = express.Router();
const {data_manipulation,send_to_client} = require('../config/wechat_data_manipulation');
const {Wechat_Authentication, requestToWechat} = require('../config/wechat_auth'); //wechat authentication
const {encrypt, SaveEncryption, GenerateToken} = require('../config/wechat_token_manipulation');
const User_wechat = require('../src/models/wechat_userModel');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// wechat automatic login
router.post('/wechat_automatic_login',Wechat_Authentication, (req, res) => {
    if(res.locals.msg!='get code'){
        let data=[];
        data.push({ msg:"valid token"});
        send_to_client(res,data);}
    else{
        res.end();
    }
});

// wechat search for teacher
// router.post('/wechat_search',Wechat_Authentication, (req, res) => {
//     let {university, subject, year} = req.body;
//     let data = [];
//     if(res.locals.msg=='get code'){
//         data.push({msg: res.locals.msg});
//         send_to_client(res, data);
//     }
//     else{
//         data.push({msg:'erorr'});
//         if (university == undefined) {
//             data.push({error: "请填入所有资料"});
//             send_to_client(res, data);
//         } else if (subject == undefined) {
//             data.push({error: "请填入所有资料"});
//             send_to_client(res, data);
//         } else if (year == undefined) {
//             data.push({error: "请填入所有资料"});
//             send_to_client(res, data);
//         } else {
//             let searching={membership:"teacher.0"}; //need to include .1 and other memberships
//             if (university != "Any") {
//                 searching.university = university
//             } //needs testing
//             if (subject != "Any") {
//                 searching.subject = subject
//             }
//             if (year != "任何") {
//                 searching.year = year
//             }
//             User_wechat.find(searching).then(user => {
//                 if (user) {
//                     if (user.length > 0) {
//                         for (var i = 0; i < user.length; i++) {
//
//                             data.push({
//                                 username: user[i].username,
//                                 year: user[i].year,
//                                 university: user[i].university,
//                                 subject: user[i].subject
//                             });
//                             if (user.length - 1 == i) {
//                                 data[0].msg='found teacher';
//
//                                 send_to_client(res, data);
//                             }
//                         }
//                     } else {
//                         data.push({error: "无此老师"});
//
//                         send_to_client(res, data);
//                     }
//                 } else {
//                     res.end();
//                 }
//
//             });
//         }}
// });

//teacher update
// router.post('/wechat_teacher_update',Wechat_Authentication,(req, res) => {
//
//     let {year, subject, university} = req.body;
//     let data=[];
//     if (year!=undefined &&  subject!=undefined && university!=undefined){
//         // res.locals.wechat_data=[teacher,student,email,username];
//         if(res.locals.msg!='get code'){
//             User_wechat.findOne({ username: res.locals.wechat_data[3] }).then(user => {
//                 if (user) {
//                     user.year=year;
//                     user.subject=subject;
//                     user.university=university;
//                     data.push({ msg:"teacher updated"});
//                     user.save();
//                     send_to_client(res,data);
//                 }
//             })}
//         else{
//             data.push({ msg:"get code"});
//             send_to_client(res,data);}
//     }
//     else{
//         data.push({ msg:"error"});
//         data.push({ msg:'请输入所有资料'});
//         send_to_client(res,data);}
//
//
// });






//wechat login request start
router.post('/wechat_login', (req, res) => {
    let {email, password, code} = req.body;
    let errors = [];
    let username;
    let membership;
    let token;
    let data=[];
    let wechat_data;
    let membership_type;
    if(!email || !password){
        errors.push({ msg: '请填入所有资料' });
        data_manipulation(res, data, errors, username, membership,membership_type,token);
    }
    else {

        User_wechat.findOne({ email: email }).then(user => {
            if (user) {

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        var promise1 = new Promise(function(resolve, reject) {
                            requestToWechat(code,resolve);
                        });

                        promise1.then( value=>{   // value[0]=session_key    value[1]=openid

                            user.session_key=SaveEncryption(encrypt(value[0]));
                            user.openid=SaveEncryption(encrypt(value[1]));
                            username=user.username;
                            membership=user.membership;
                            membership_type=user.membership_type;
                            let token = GenerateToken(username,email,membership,membership_type);
                            wechat_data=[user.year,user.subject,user.university];
                            user.save();
                            data_manipulation(res, data, errors, username, membership,membership_type,token);

                        });
                    } else {

                        errors.push({ msg: '登入失败' });
                        data_manipulation(res, data, errors, username, membership,membership_type,token);
                    }
                });

            }
            else{
                errors.push({ msg: '登入失败' });
                data_manipulation(res, data, errors, username, membership,membership_type,token);
            }


        })


    }

});
//wechat login request end


//wechat register request start
router.post('/wechat_register', (req, res) => {

    let { username, email, password, password2,wechat} = req.body;


    let errors = [];
    if (!username || !email || !password || !password2) {
        errors.push({ msg: '请填入所有资料' })
    }
    else if (!validator.isEmail(email)) { errors.push({ msg: 'Email不正确' }); }
    else if (password != password2) {
        errors.push({ msg: '密码不同' })
    }
    else if (password.toLowerCase().includes('password')) {
        errors.push({ msg: '密码不能有 "password"' });
    }
    else if (password.length < 6) {
        errors.push({ msg: '密码必须至少6个字符' });
    }
    if (errors.length > 0) {
        if(wechat==1){
        data_manipulation_register(res,errors);}
        else{send_to_client_register(res,errors,username,email,password,password2)}
    } else {

        User_wechat.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg:'已有此email' });

                if(wechat==1){
                    data_manipulation_register(res,errors);}
                else{send_to_client_register(res,errors,username,email,password,password2)}
            } else {

                User_wechat.findOne({ username: username }).then(user => {
                    if (user) {
                        errors.push({ msg:'已有此户名称' });

                        if(wechat==1){
                            data_manipulation_register(res,errors);}
                        else{send_to_client_register(res,errors,username,email,password,password2)}
                    }
                    else{
                        const newUser_wechat = new User_wechat({
                            username,
                            email,
                            password
                        });

                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newUser_wechat.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser_wechat.password = hash;
                                newUser_wechat
                                    .save()
                                    .then(user => {


                                        if(wechat==1){
                                            data_manipulation_register(res,errors);}
                                        else{
                                            errors.push({ msg: '用户注册成功' });
                                            send_to_client_register(res,errors,username,email,password,password2)}
                                    })
                                    .catch(err => console.log(err));
                            });
                        });
                    }
                });
            }
        })
    }
    function data_manipulation_register(res,errors) {
        let data= [];
        data.push({ errors:errors});

        if (errors==''){
            data.push({ saved:'用户注册成功'});
            send_to_client(res,data);
        }
        else{
            send_to_client(res,data);
        }
    }

    function send_to_client_register(res,errors,username,email,password,password2){
        res.render('wechat_register', {
            errors,
            username,
            email,
            password,
            password2
        });
    }






});
//wechat register request end


module.exports = router;
