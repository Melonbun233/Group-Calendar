var express = require('express');
var router = express.Router();
var parser = require('body-parser');
const url = require('url');  
const querystring = require('querystring');

const {check, validationResult} = require('express-validator/check');
//var temp = {"email" : "234@gmail.com"};

/* GET users. */