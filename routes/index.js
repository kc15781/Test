"use strict";

const express = require('express'); // include 'express' module
const router = express.Router(); 
//const userRouter = require('./user');
//const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


const app = express();

//app.use(userRouter);

// Welcome Page

//router.get('/', forwardAuthenticated, (req, res) => res.render('landing')); // if not logged in direct to landing

// router.get('/undergraduate', (req, res) =>
//     res.render('undergraduate', {
//         user: req.user
//     })
// );

router.get('/', (req, res) => res.render('home')); 


//router.get('/secret', (req, res) => res.render('secret'));

//router.get('/presessional', ensureAuthenticated, (req, res) => res.render('presessional'));

//router.get('/terms', (req, res) => res.render('terms'));

//router.get('/career', (req, res) => res.render('career'));

//router.get('/travel', (req, res) => res.render('travel'));

//router.get('/tutorial', (req, res) => res.render('tutorial'));

//router.get('/wechat_register', (req, res) => res.render('wechat_register'));

// router.get('/foundation', foundationPageCallBack);
// function foundationPageCallBack (req, res) {
//
//     res.render('foundation');
//
// }


//router.get('/test', testPageCallBack);
//function testPageCallBack (req, res) {
    
//    res.render('test');

//}

// router.get('/postgraduate', postgraduatePageCallBack);
// function postgraduatePageCallBack (req, res) {
//     if (req.isAuthenticated()){
//         return res.render('postgraduate', {
//             user: req.user
//         });
//     }
//     res.redirect('/login')
// }

// router.get('/entrepreneurship', entrepreneurshipPageCallBack);
// function entrepreneurshipPageCallBack (req, res) {
//     if (req.isAuthenticated()){
//         return res.render('entrepreneurship', {
//             user: req.user
//         });
//     }
//     res.redirect('/login')
// }

// router.get('/tutorials', tutorialsPageCallBack);
// function tutorialsPageCallBack (req, res) {
//     if (req.isAuthenticated()){
//         return res.render('tutorials', {
//             user: req.user
//         });
//     }
//     res.redirect('/login')
// }

// router.get('/tutors', tutorsPageCallBack);
// function tutorsPageCallBack (req, res) {
//     if (req.isAuthenticated()){
//         return res.render('tutors', {
//             user: req.user
//         });
//     }
//     res.redirect('/login')
// }

module.exports = router;
