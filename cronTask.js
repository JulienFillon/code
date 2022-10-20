var cron = require('node-cron');
const http = require('http');

let execRequest = function(data, path, method, callback, errorCallback){
    const options = {
      hostname : '127.0.0.1',
      port     : 3002,
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
    for(var i = 0; i<pendingTransactionsCode.length; ++i ){
        var pendingTransaction = pendingTransactionsCode[i];
        let fromAccount = null;
        var firstCallback = function(toAccount){
            var secondCallback = function(fromAccount){

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
            fromAccount = getAccount(pendingTransaction.fromAccount, secondCallback);
        };
        let toAccount = getAccount(pendingTransaction.toAccount, firstCallback);
    }
};

cron.schedule("*/5 * * * * *", getPendingTransactions);