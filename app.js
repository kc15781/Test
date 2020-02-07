"use strict";
const express = require('express');
const app = express();
const indexRouter = require('./routes/index');
const createError = require('http-errors');


// store the port in the variable 'port', use the existing port or 3000
app.set('port', process.env.PORT || 3000);
app.set("view engine", "ejs"); //use ejs as template engine
app.use(express.static(__dirname + '/public')); //allow access to files in this folder, __dirname is the directory of current .js
//app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico'))); //small icon that apears at top of the browser tab


app.use(indexRouter);
// catch 404 and forward to error handler
app.use(errorcatcher);
function errorcatcher(req, res, next) {
    next(createerror(404));
}
// error handler
app.use(errorHandler);
function errorHandler(err, req, res, next) {
    // render the error page
    res.status(err.status || 500);
    res.render('error');
}

//listening on the port - will process all the data coming from this port
app.listen(app.get('port'), function () { console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.'); });
