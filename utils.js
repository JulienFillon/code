
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
            var dataUser = configuration.data.users[i];
            var newUser = utils.user.add(dataUser);

            for(var j =0;  j<dataUser.accounts.length; ++j){
                var dataAccount = dataUser.accounts[j];
                var createdAccount = utils.account.add(dataAccount, newUser);

                for(var k =0;  k<dataAccount.transactions.length; ++k){
                    utils.transaction.add(dataAccount.transactions[k], createdAccount);
                }
            }
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
            user.addAccount(createdAccount);

            return data.accounts[createdAccount.getCode()] = createdAccount;
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

            creditAccount.addTransaction(createdTransaction);

            if(debitAccount){
                debitAccount.addTransaction(createdTransaction);
                // if(debitAccount.getBalance() < transactionData.credit){
                //     console.log("la");
                //     createdTransaction.setStatus("REFUSED");
                //     // return next({message : 'non-sufficient funds', code : 504});
                // }
            }

            return data.transactions[createdTransaction.getCode()] = createdTransaction;
        }
    }
};

module.exports = utils;