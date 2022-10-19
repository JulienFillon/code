var account = require("./Account");
const utils = require("../utils");

let Transaction = class {

    #name        = null;
    #date        = null;
    #debit       = null;
    #credit      = null;
    #fromAccount = null;
    #toAccount   = null;
    #status      = null;
    #code        = null;
    #currency    = null;

    constructor(code) {
        this.#name        = null;
        this.#date        = null;
        this.#debit       = null;
        this.#credit      = null;
        this.#fromAccount = null;
        this.#toAccount   = null;
        this.#status      = null;
        this.#currency    = null;

        this.#setCode(code);
    };


    setName = function(name) {
        this.#name = name;
    };
    getName = function() {
        return this.#name;
    };
    setDate = function(date) {
        this.#date = date;
    };
    getDate = function() {
        return this.#date;
    };
    setDebit = function(debit) {
        this.#debit = debit;
    };
    getDebit = function() {
        return this.#debit;
    };
    setCredit = function(credit) {
        this.#credit = credit;
    };
    getCredit = function() {
        return this.#credit;
    };
    setFromAccount = function(account) {
        this.#fromAccount = account;
    };
    getFromAccount = function() {
        return this.#fromAccount;
    };
    setToAccount = function(account) {
        this.#toAccount = account;
    };
    getToAccount = function() {
        return this.#toAccount;
    };
    setStatus = function(status) {
        this.#status = status;
    };
    getStatus = function() {
        return this.#status;
    };
    #setCode = function(code) {
        this.#code = code ? code : utils.generateCode(10);
    };
    getCode = function() {
        return this.#code;
    };
    setCurrency = function(currency) {
        this.#currency = currency;
    };
    getCurrency = function() {
        return this.#currency;
    };
};

module.exports = Transaction;