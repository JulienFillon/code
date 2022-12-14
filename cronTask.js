/*
    This file is the transaction handler service
    It is working with a cron task pulling the pending transactions (every 5s in this version)
    It is also in charge for checking if the transaction is OK
    It update the transactions and the link accounts
*/

var cron = require('node-cron');
const http = require('http');

let execRequest = function(data, path, method, callback, errorCallback){
    const options = {
      hostname : '127.0.0.1',
      port     : 3000,
      path     : path,
      method   : method,
      headers  : {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    const req = http.request(options, (resp) => {
      resp.setEncoding('utf8');
        var body = [];

        resp.on('data', function(chunk) {
            body.push(chunk);
        });

        resp.on('end', () => {
            if(resp.statusCode == 200){
                if(callback){
                    callback(JSON.parse(body));
                }
            } else if(errorCallback){ // need to revert the previous modification => no time to do it
                console.log(resp.statusMessage);
                errorCallback(resp.statusMessage);
            }
        });

    });

    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });

    req.write(data);
    req.end();
};

let getAccount = function(code, callback, errorCallback){
    const postData = JSON.stringify({
      'code': code
    });
    execRequest(postData, '/getAccount', 'GET', callback , errorCallback);
};

let creditAccountBalance = function(code, value, callback, errorCallback){
    const postData = JSON.stringify({
      'code': code,
      'value' : value
    });
    execRequest(postData, '/creditAccountBalance', 'POST', callback, errorCallback );
};

let debitAccountBalance = function(code, value, callback, errorCallback){
    const postData = JSON.stringify({
      'code': code,
      'value' : value
    });
    execRequest(postData, '/debitAccountBalance', 'POST', callback, errorCallback );
};

let updateTransaction = function(code, status, message, callback, errorCallback){
    const postData = JSON.stringify({
      'code': code,
      'status' : status,
      'message' : message
    });
    execRequest(postData, '/updateTransaction', 'POST', callback, errorCallback);
};

let getPendingTransactions = function(){
    const postData = JSON.stringify({});
    execRequest(postData, '/getPendingTransactions', 'GET', handlePendingTransaction );
};


let handlePendingTransaction = function(pendingTransactionsCode){
    // I should get here an authorisation token to continue de process -> no time to do it
    for(var i = 0; i<pendingTransactionsCode.length; ++i ){

        var firstCallback = function(pendingTransaction, toAccount){
            var secondCallback = function(pendingTransaction, fromAccount){

                if(parseFloat(fromAccount.balance) < parseFloat(pendingTransaction.credit)){
                    updateTransaction(pendingTransaction.code, "FAILED", "Insufficient Funds");
                    return;
                } else {

                    creditAccountBalance(toAccount.code, parseFloat(pendingTransaction.credit), function(fromAccountCode, credit) {
                        debitAccountBalance(fromAccountCode, credit, function(pendingTransactionCode, status) {
                            updateTransaction(pendingTransactionCode, status);
                        }.bind(this, pendingTransaction.code, "EXECUTED"));
                    }.bind(this, fromAccount.code, parseFloat(pendingTransaction.credit)));
                }
            };
            fromAccount = getAccount(pendingTransaction.fromAccount, secondCallback.bind(this, pendingTransaction));
        };
        let toAccount = getAccount(pendingTransactionsCode[i].toAccount, firstCallback.bind(this, pendingTransactionsCode[i]) );
    }
};

cron.schedule("*/5 * * * * *", getPendingTransactions);