"use strict";

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const validator = require('validator');


// Load User model
const User = require('../src/models/userModel');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { sendWelcomeEmail } = require('../src/emails/account');


// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login')); // if already logged in, redirect to home when login page is visited, otherwise load login page

// Register Page
router.get('/signup', forwardAuthenticated, (req, res) => res.render('signup'));

router.get('/membership', ensureAuthenticated, (req, res) => res.render('membership'));

// Register
router.post('/signup', (req, res) => {
    const { firstname, surname, email, wechat, password, password2, university, year, course } = req.body;

    let errors = [];

    if (!firstname || !surname || !email || !wechat || !password || !password2 || !university || !year || !course) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('signup', {
            errors,
            firstname,
            surname,
            email,
            wechat,
            password,
            password2,
            university,
            year,
            course
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('signup', {
                    errors,
                    firstname,
                    surname,
                    email,
                    wechat,
                    password,
                    password2,
                    university,
                    year,
                    course
                });
            } else {
                const newUser = new User({
                    firstname,
                    surname,
                    email,
                    wechat,
                    password,
                    university,
                    year,
                    course
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                sendWelcomeEmail(user.email, user.firstname);
                                req.flash(
                                    'success_msg',
                                    'You can now log in your Erdemy account'
                                );
                                res.redirect('/login');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }

        });
    }
});

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});


//change user details
router.get('/user_change', ensureAuthenticated);

router.post('/user_change', (req, res) => {
    var { firstname, surname, email, wechat, password, password2, university, year, course } = req.body;

    const firstname_old = req.user.firstname;
    const surname_old = req.user.surname;
    const email_old = req.user.email;
    const wechat_old = req.user.wechat;
    const university_old = req.user.university;
    const year_old = req.user.year;
    const course_old = req.user.course;
    const password_entered = password;
    const password2_entered = password2;

    let errors = [];
    email = email.toLowerCase();
    email = email.trim();


    if (firstname != "") {
        req.user.firstname = firstname.trim();


    }
    if (surname != "") {
        req.user.surname = surname.trim();

    }


    if (wechat != "") {
        req.user.wechat = wechat.trim();

    }
    if (password != "") {
        password = password.trim();
        password2 = password2.trim();
        if (password != password2) { errors.push({ msg: 'passwords dont match' }); }
        else if (password.toLowerCase().includes('password')) {
            errors.push({ msg: 'Password cannot contain "password"' });
        }
        else if (password.length < 7) {
            errors.push({ msg: 'Password needs to be longer than 6 characters' });
        }
        else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err;
                    password = hash;
                    req.user.password = password.trim();

                });
            });
        }

    }
    if (university != "") {
        req.user.university = university;

    }
    if (year != "") {
        req.user.year = year.trim();

    }
    if (course != "") {
        req.user.course = course;

    }


    User.findOne({ email: email }).then(user_old => {
        if (user_old) {
            errors.push({ msg: 'email already registered' });
        }
        else if (email != ""){
                if (!validator.isEmail(email)) { errors.push({ msg: 'Email not valid' }); }
                else {
                    req.user.email = email;

                }

        }



        if (errors != "") {
            res.render('membership', {
                errors,
                firstname_old,
                surname_old,
                email_old,
                wechat_old,
                university_old,
                year_old,
                course_old,
                firstname,
                surname,
                email,
                wechat,
                password_entered,
                password2_entered,
                university,
                year,
                course
            })
        }
        else {
            req.user.save();

            const firstname_new = req.user.firstname;
            const surname_new = req.user.surname;
            const email_new = req.user.email;
            const wechat_new = req.user.wechat;
            const university_new = req.user.university;
            const year_new = req.user.year;
            const course_new = req.user.course;
            res.render('membership', {
                firstname_new,
                surname_new,
                email_new,
                wechat_new,
                university_new,
                year_new,
                course_new
            })

        }
    })








});


module.exports = router;