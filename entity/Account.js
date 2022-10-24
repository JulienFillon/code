var user = require("./User");
var transaction = require("./Transaction");
const utils = require("../utils");

let Account = class {

    #users = null;
    #balance = null;
    #transactions = null;
    #openingDate = null;
    #code = null;
    #name = null;
    #currency = null;

    constructor(code) {
        this.#users        = {};
        this.#balance      = null;
        this.#transactions = {};
        this.#openingDate  = null;
        this.#name         = null;
        this.#currency     = null;

        this.#setCode(code);
    };


    getUsers = function() {
        return this.#users;
    };
    addUser = function(newUser) {
        this.#users[newUser.getCode()] = newUser;
    };
    removeUser = function(user) {
        delete this.#users[user.getCode()];
    };
    getBalance = function() {
        return this.#balance;
    };
    setBalance = function(balance) {
        this.#balance = balance;
    };
    getTransactions = function() {
        return this.#transactions;
    };
    addTransaction = function(newTransaction) {
        this.#transactions[newTransaction.getCode()] = newTransaction;
    };
    getOpeningDate = function() {
        return this.#openingDate;
    };
    setOpeningDate = function(openingDate) {
        this.#openingDate = openingDate;
    };

    getName = function() {
        return this.#name;
    };
    setName = function(name) {
        this.#name = name;
    };
    getCode = function() {
        return this.#code;
    };
    #setCode = function(code) {
        this.#code = code ? code : utils.generateCode(10);
    };

    getCurrency = function() {
        return this.#currency;
    };
    setCurrency = function(currency) {
        this.#currency = currency;
    };

    getData = function(){
        return {
            "balance"     : this.#balance,
            "code"        : this.#code,
            "name"        : this.#name,
            "openingDate" : this.#openingDate,
            "currency"    : this.#currency
        };
    };

    credit = function(value){
        if(isNaN(value)){
            throw new Error("value is not a number");
        }

        this.#balance = parseFloat(this.#balance) + parseFloat(value);
    };
    debit = function(value){
        if(isNaN(value)){
            throw new Error("value is not a number");
        }

        if(this.#balance >= parseFloat(value)) {
            this.#balance = parseFloat(this.#balance) - parseFloat(value);
        } else {
            throw new Error("Insufficient Funds");
        }
    };

}

module.exports = Account;