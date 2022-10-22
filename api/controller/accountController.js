'use strict';
var data  = require("../../data.js");
var utils = require("../../utils.js");

var accountController = {
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

            let debitAccount = data.accounts[initialAccountCode];
            if(!debitAccount){
                return next({message : 'can not find the origin account', code : 503});
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
                res.send(JSON.stringify({"result" : "OK"}));
            } else {
                return next({message : 'account not found', code : 500});
            }
        } catch(err){
            return next({message : err.message, code : 500});
        }
    },
};

module.exports = accountController;
