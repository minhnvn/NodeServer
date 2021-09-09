const express = require('express');
var bodyParserTest = require('body-parser')
var app = express();

var jsonParser = bodyParserTest.json()
var textParser = bodyParserTest.text()
var urlencodedParser = bodyParserTest.urlencoded({ extended: false })
const port = 11111;

var userCtrl = require('./UserController');
var InitMongo = require('./Mongo').InitMongo;

app.post('/register',jsonParser, userCtrl.register);
app.post('/login', jsonParser, userCtrl.login);
app.post('/logout',jsonParser, userCtrl.logout);
//app.use(textParser);
app.get('/UserInfo',textParser, userCtrl.getUserProfile);

if(InitMongo())
{
    app.listen(port, function(error){
    if (error) {
        console.log("Something went wrong");
    }
    console.log("server is running port:  " + port);
    })
}