'use strict';
var user        = require("../entity/User");
var data        = require("../data.js");
var utils        = require("../utils.js");
var transaction = require("../entity/Transaction");
var account     = require("../entity/Account");
let fs = require('fs');

var controllers = {
    errorHandler : function(err, req, res, next) {
        if (res.headersSent) {
            return next(err);
        }
        res.status(err.code ? err.code :  500).send(err.message ? err.message : err);
    },
    addAccount: function(req, res, next) {
        try{
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
        } catch(err){
            return next({message : err.message, code : 500});
        }
    },
    getAccount : function(req, res, next) {
        try{
            var accountCode = req.body.code;
            var account = utils.account.get(accountCode);

            if(account){
                res.send(account.getData());
            } else {
                return next({message : 'account not found', code : 500});
            }
        } catch(err){
            return next({message : err.message, code : 500});
        }
    },
    debitAccountBalance: function(req, res, next) {
        try{
            var accountCode = req.body.code;
            var value = req.body.value;
            var account = utils.account.get(accountCode);

            if(account){
                account.debit(value);
                console.log(account.getBalance());
                res.send(JSON.stringify({"result" : "OK"}));
            } else {
                return next({message : 'account not found', code : 500});
            }
        } catch(err){
            return next({message : err.message, code : 500});
        }
    },
    creditAccountBalance: function(req, res, next) {
        try{
            var accountCode = req.body.code;
            var value = req.body.value;
            var account = utils.account.get(accountCode);
            if(account){
                account.credit(value);
                console.log(account.getBalance());
                res.send(JSON.stringify({"result" : "OK"}));
            } else {
                return next({message : 'account not found', code : 500});
            }
        } catch(err){
            return next({message : err.message, code : 500});
        }
    },
    getPendingTransactions: function(req, res, next) {
        var pendingTransactions = [];
        for(var i in data.pendingTransactions){
            pendingTransactions.push(data.pendingTransactions[i].getData());
        }
        res.send(pendingTransactions);
    },
     updateTransaction: function(req, res, next) {
        var transactionCode = req.body.code;
        var status = req.body.status;
        var message = req.body.message;

        var transaction = utils.transaction.get(transactionCode);

        if(transaction){
            if(data.pendingTransactions[transactionCode]){
                data.transactions[transactionCode] = transaction;
                delete data.pendingTransactions[transactionCode];
            }

            transaction.setReason(message);
            transaction.setStatus(status);
            res.send(JSON.stringify({"result" : "OK"}));
        } else {
            return next({message : 'transaction not found', code : 500});
        }
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
