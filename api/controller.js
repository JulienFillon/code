'use strict';
var user        = require("../entity/User");
var data        = require("../data.js");
var utils        = require("../utils.js");
var transaction = require("../entity/Transaction");
var account     = require("../entity/Account");
let fs = require('fs');

var controllers = {
    errorHandler : function(err, req, res, next) {
      res.status(err.code).send(err.message);
    },
    addAccount: function(req, res, next) {
        var userCode = req.body.userCode;
        var initialCredit = req.body.initialCredit;
        var initialAccountCode = req.body.initialAccountCode;

        if(!userCode){
            return next({message : 'missing userCode data', code : 500});
        }
        if(!initialCredit){
            return next({message : 'missing initialCredit data', code : 501});
        }

        let user = data.users[userCode];
        if(!user){
            return next({message : 'user not found', code : 502});
        }

        if(initialCredit < 0){
            return next({message : 'initialCredit need to be a positive number', code : 503});
        }

        let accounts = user.getAccounts();
        let debitAccount = null;
        if(initialAccountCode){
            debitAccount = user.getAccount(initialAccountCode);
            if(!debitAccount){
                return next({message : 'can not find the origin account', code : 503});
            }
        } else {
            for(var i in accounts){
                debitAccount = accounts[i];
                break;
            }
        }
        let accountData = {};
        let createdAccount = utils.account.add(accountData , user);

        if(initialCredit > 0){
            let transactionData = {
                credit : initialCredit
            };
            utils.transaction.add(transactionData, createdAccount, debitAccount);
        }

        res.send("ok");
    },
    sumupPage: function(req, res) {
        var userCode = req.params.userCode;
        var user = data.users[userCode];
        if(user){
            for(var i in user.getAccounts()){
                var account = user.getAccounts()[i];
                for(var j in account.getTransactions()){
                    var transaction = account.getTransactions()[j];
                    console.log(transaction.getName());
                }
                console.log(account.getName());
            }
            res.render('index.pug', { title: 'Hey', message: 'Hello there!' + user.getFirstName() });
        } else {
            res.render('index.pug', { title: 'Hey', message: 'Hello there!'});
        }
    },
};

module.exports = controllers;
