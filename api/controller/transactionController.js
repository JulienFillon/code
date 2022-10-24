'use strict';
var data  = require("../../data.js");
var utils = require("../../utils.js");

var transactionsController = {
    errorHandler : function(err, req, res, next) {
        if (res.headersSent) {
            return next(err);
        }
        res.status(err.code ? err.code :  500).send(err.message ? err.message : err);
    },
    getPendingTransactions: function(req, res, next) {
        try{
            var pendingTransactions = [];
            for(var i in data.pendingTransactions){
                pendingTransactions.push(data.pendingTransactions[i].getData());
            }
            res.send(pendingTransactions);
        } catch(err){
            return next({message : err.message, code : 500});
        }
    },
     updateTransaction: function(req, res, next) {
        try{
            var transactionCode = req.body.code;
            var status = req.body.status;
            var message = req.body.message;


            if(!transactionCode){
                return next({message : 'missing code data', code : 500});
            }
            if(!status){
                return next({message : 'missing status data', code : 500});
            }

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
        } catch(err){
            return next({message : err.message, code : 500});
        }
    }
};

module.exports = transactionsController;
