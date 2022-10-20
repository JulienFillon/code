'use strict';

var express = require("express");
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

const controller = require('./controller');

module.exports = function(app) {

   // for parsing application/json
   app.use(bodyParser.json());

   // for parsing application/xwww-
   app.use(bodyParser.urlencoded({ extended: true }));
   //form-urlencoded

   // for parsing multipart/form-data
   app.use(upload.array());
   app.use(express.static('public'));

   app.route('/account')
      .post(controller.addAccount);
   // add a security to accept only url
   app.route('/getAccount')
      .get(controller.getAccount);
   app.route('/debitAccountBalance')
      .post(controller.debitAccountBalance);
   app.route('/creditAccountBalance')
      .post(controller.creditAccountBalance);

   app.route('/getPendingTransactions')
      .get(controller.getPendingTransactions);
   app.route('/updateTransaction')
      .post(controller.updateTransaction);


   app.route('/sumup')
      .get(controller.sumupPage);
   app.route('/sumup/:userCode')
      .get(controller.sumupPage);
   app.use(controller.errorHandler);
};