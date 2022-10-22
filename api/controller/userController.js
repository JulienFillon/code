'use strict';
var data  = require("../../data.js");
var utils = require("../../utils.js");

var userController = {
    errorHandler : function(err, req, res, next) {
        if (res.headersSent) {
            return next(err);
        }
        res.status(err.code ? err.code :  500).send(err.message ? err.message : err);
    },
    getUserInfo: function(req, res, next) {
        try{
            var userCode = req.body.userCode;

            if(!userCode){
                return next({message : 'missing userCode data', code : 500});
            }

             let user = data.users[userCode];
            if(!user){
                return next({message : 'user not found', code : 502});
            }

            if(user){
                var accounts = []
                var userAccounts = user.getAccounts();
                for(var i in userAccounts){
                    var account = userAccounts[i].getData();
                    account.transactions = [];
                    var transactions = userAccounts[i].getTransactions();
                    for(var j in transactions){
                        account.transactions.push(transactions[j].getData());
                    }
                    accounts.push(account);
                }
                res.send({
                    "accounts"  : accounts,
                    "user"      : user.getData(),
                });
            } else {
                res.send({"result" : "KO"});
            }
        } catch(err){
            return next({message : err.message, code : 500});
        }
    },
    sumupPage: function(req, res, next) {
        try{
            var userCode = req.params.userCode;
            var user = data.users[userCode];

            if(user){
                var accounts = []
                var userAccounts = user.getAccounts();
                for(var i in userAccounts){
                    var account = userAccounts[i].getData();
                    account.transactions = [];
                    var transactions = userAccounts[i].getTransactions();
                    for(var j in transactions){
                        account.transactions.push(transactions[j].getData());
                    }
                    accounts.push(account);
                }
                res.render('summupPage.pug', {
                    pageTitle : ' User info sumup page',
                    accounts  : accounts,
                    user      : user.getData(),
                });
            } else {
                res.render('error.pug');
            }
        } catch(err){
            return next({message : err.message, code : 500});
        }
    }
};

module.exports = userController;
