'use strict';

var express = require("express");
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

const userController = require('./controller/userController');
const transactionsController = require('./controller/transactionController');
const accountController = require('./controller/accountController');

module.exports = function(app) {

   // for parsing application/json
   app.use(bodyParser.json());

   // for parsing application/xwww-
   app.use(bodyParser.urlencoded({ extended: true }));
   //form-urlencoded

   app.route('/account')
      .post(accountController.addAccount);
   app.route('/getAccount')
      .get(accountController.getAccount);
   app.route('/debitAccountBalance')
      .post(accountController.debitAccountBalance);
   app.route('/creditAccountBalance')
      .post(accountController.creditAccountBalance);

   app.route('/getPendingTransactions')
      .get(transactionsController.getPendingTransactions);
   app.route('/updateTransaction')
      .post(transactionsController.updateTransaction);

   app.route('/getUserInfos')
      .get(userController.getUserInfo);
   app.route('/sumup')
      .get(userController.sumupPage);
   app.route('/sumup/:userCode')
      .get(userController.sumupPage);
   app.use(userController.errorHandler);


   app.get("*", (req, res) => {
      res.render('error.pug');
   });
};