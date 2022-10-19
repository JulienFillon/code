'use strict';
var user        = require("../entity/User");
var data        = require("../data.js");
var transaction = require("../entity/Transaction");
var account     = require("../entity/Account");
let fs = require('fs');

var controllers = {
    addAccount: function(req, res) {
        res.send("recieved your request!"+ req.body.userCode);
    },
    getPendingTransactions: function(req, res) {
        var pendingTransactions = ["rolo"];
        for(var i in data.transactions){
            var transaction = data.transactions[i];
            if(transaction.getStatus() == "CREATED" ){
                pendingTransactions.push(transaction);
            }
        }
        res.send(pendingTransactions);
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
