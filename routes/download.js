const express = require('express');
const path = require('path');
const router = express.Router();
const userRouter = require('./user');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const app = express();
app.use(userRouter);


router.get('/presessional/saq1', ensureAuthenticated, (req, res) => {
    res.download(path.join(__dirname, "../", "public/files/saq1.pptx"));
});

router.get('/presessional/saq2', ensureAuthenticated, (req, res) => {
    res.download(path.join(__dirname, "../", "public/files/saq2.pptx"));
});

router.get('/presessional/saq3', ensureAuthenticated, (req, res) => {
    res.download(path.join(__dirname, "../", "public/files/saq3.pptx"));
});

router.get('/presessional/saq4', ensureAuthenticated, (req, res) => {
    res.download(path.join(__dirname, "../", "public/files/saq4.pptx"));
});

router.get('/presessional/saq5', ensureAuthenticated, (req, res) => {
    res.download(path.join(__dirname, "../", "public/files/saq5.pptx"));
});

router.get('/presessional/saq6', ensureAuthenticated, (req, res) => {
    res.download(path.join(__dirname, "../", "public/files/saq6.pptx"));
});

router.get('/presessional/saq7', ensureAuthenticated, (req, res) => {
    res.download(path.join(__dirname, "../", "public/files/saq7.pptx"));
});

router.get('/presessional/mrr1', ensureAuthenticated, (req, res) => {
    res.download(path.join(__dirname, "../", "public/files/语言课之MRR干货分享erdemy.pdf"));
});

router.get('/presessional/mrr2', ensureAuthenticated, (req, res) => {
    res.download(path.join(__dirname, "../", "public/files/84分范文.pdf"));
});

router.get('/presessional/reading2018', ensureAuthenticated, (req, res) => {
    res.download(path.join(__dirname, "../", "public/files/reading2018.pdf"));
});

router.get('/presessional/10weeks', ensureAuthenticated, (req, res) => {
    res.download(path.join(__dirname, "../", "public/files/10周宣讲会.pptx"));
});

module.exports = router;