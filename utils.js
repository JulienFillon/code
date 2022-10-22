
var utils = {
    generateCode : function(length){
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    fillTestData : function(){
        const configuration = require('./config/'+process.env.NODE_ENV+'.json');
        for(var i = 0; i<configuration.data.users.length; ++i){
            utils.user.add(configuration.data.users[i]);
        }

        for(var i =0; i<configuration.data.accounts.length; ++i){
            var account = configuration.data.accounts[i];
            utils.account.add(account, utils.user.get(account.user));
        }

        for(var i =0; i<configuration.data.transactions.length; ++i){
            var transaction = configuration.data.transactions[i];
            utils.transaction.add(transaction, utils.account.get(transaction.to), utils.account.get(transaction.from));
        }
    },
    user : {
        add : function(userData){
            let user = require("./entity/User");
            let data = require("./data.js");

            let newUser = new user(userData.code);
            newUser.setFirstName(userData.firstName);
            newUser.setLastName(userData.lastName);
            newUser.setEmail(userData.email);
            newUser.setCountry(userData.country);
            newUser.setPhoneNumber(userData.phoneNumber);
            data.users[newUser.getCode()] = newUser;

            return newUser;
        },
        get : function(code){
            let data = require("./data.js");
            return data.users[code];
        }
    },
    account : {
        add : function(accountData, user){
            let account = require("./entity/Account");
            let data    = require("./data.js");

            let createdAccount = new account(accountData.code);
            createdAccount.addUser(user);
            createdAccount.setBalance(accountData.balance ? accountData.balance : 0);
            createdAccount.setOpeningDate(new Date().toLocaleDateString());
            createdAccount.setName(accountData.name ? accountData.name : "DEFAULT");
            createdAccount.setCurrency(accountData.currency ? accountData.currency : "EUR");
            user.addAccount(createdAccount);

            return data.accounts[createdAccount.getCode()] = createdAccount;
        },
        get : function(code){
            let data = require("./data.js");
            return data.accounts[code];
        }
    },
    transaction : {
        add : function(transactionData, creditAccount, debitAccount){
            let transaction = require("./entity/Transaction");
            let data        = require("./data.js");

            let createdTransaction = new transaction();
            createdTransaction.setWording(transactionData.name ? transactionData.name : "DEFAULT");
            createdTransaction.setDate(new Date().toLocaleDateString());
            createdTransaction.setCredit(transactionData.credit);
            createdTransaction.setFromAccount(debitAccount);
            createdTransaction.setToAccount(creditAccount);
            createdTransaction.setStatus("CREATED");
            createdTransaction.setCurrency(transactionData.currency);

            creditAccount.addTransaction(createdTransaction);
            debitAccount.addTransaction(createdTransaction);

            return data.pendingTransactions[createdTransaction.getCode()] = createdTransaction;
        },
        get : function(code){
            let data = require("./data.js");
            var transaction = data.transactions[code];
            if(!transaction){
                transaction = data.pendingTransactions[code];
            }
            return transaction;
        }
    }
};

module.exports = utils;