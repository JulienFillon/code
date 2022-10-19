var user = require("./entity/User");
var account = require("./entity/Account");
var transaction = require("./entity/Transaction");
const configuration = require('./config/'+process.env.NODE_ENV+'.json');
let users = {};
let accounts = {};
let transactions = {};

for(var i = 0; i<configuration.data.users.length; ++i){
    var dataUser = configuration.data.users[i];
    var newUser = new user(dataUser.code);
    newUser.setFirstName(dataUser.firstName);
    newUser.setLastName(dataUser.lastName);
    newUser.setEmail(dataUser.email);
    newUser.setCountry(dataUser.country);
    newUser.setPhoneNumber(dataUser.phoneNumber);

    for(var j =0;  j<dataUser.accounts.length; ++j){
        var dataAccount = dataUser.accounts[j];
        var createdAccount = new account(dataAccount.code);
        createdAccount.addUser(newUser);
        createdAccount.setBalance(dataAccount.balance);
        createdAccount.setOpeningDate(dataAccount.openingDate);
        createdAccount.setName(dataAccount.name);

        for(var k =0;  k<dataAccount.transactions.length; ++k){
            var dataTransaction = dataAccount.transactions[k];
            var createdTransaction = new transaction(dataTransaction.code);
            createdTransaction.setName(dataTransaction.name);
            createdTransaction.setDate(dataTransaction.date);
            createdTransaction.setDebit(dataTransaction.debit);
            createdTransaction.setCredit(dataTransaction.credit);
            createdTransaction.setFromAccount(dataTransaction.fromAccount);
            createdTransaction.setToAccount(createdAccount);
            createdTransaction.setStatus(dataTransaction.status);

            if(dataTransaction.fromAccount){
                // here we need to add transaction to the other account
            }

            transactions[createdTransaction.getCode()] = createdTransaction;
            createdAccount.addTransaction(createdTransaction);
        }

        accounts[createdAccount.getCode()] = createdAccount;
        newUser.addAccount(createdAccount);
    }

    users[newUser.getCode()] = newUser;
};


module.exports = {
    users,
    accounts,
    transactions
};