var account = require("./Account");
const utils = require("../utils");

let Transaction = class {

    #wording     = null;
    #date        = null;
    #credit      = null;
    #fromAccount = null;
    #toAccount   = null;
    #status      = null;
    #code        = null;
    #currency    = null;
    #reason      = null;

    constructor(code) {
        this.#wording     = null;
        this.#date        = null;
        this.#credit      = null;
        this.#fromAccount = null;
        this.#toAccount   = null;
        this.#status      = null;
        this.#currency    = null;
        this.#reason      = null;

        this.#setCode(code);
    };


    setWording = function(wording) {
        this.#wording = wording;
    };
    getWording = function() {
        return this.#wording;
    };
    setDate = function(date) {
        this.#date = date;
    };
    getDate = function() {
        return this.#date;
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
    setReason = function(reason) {
        this.#reason = reason;
    };
    getReason = function() {
        return this.#reason;
    };
};

module.exports = Transaction;