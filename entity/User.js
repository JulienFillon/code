const utils = require("../utils");

let User = class {
    #firstName   = null;
    #lastName    = null;
    #code        = null;
    #email       = null;
    #country     = null;
    #phoneNumber = null;
    #accounts    = {};

    constructor(code) {
        this.#firstName  = null;
        this.#lastName    = null;
        this.#code        = null;
        this.#email       = null;
        this.#country     = null;
        this.#phoneNumber = null;
        this.#accounts    = {};

        this.#setCode(code);
    }

    setFirstName = function(firstName) {
       this.#firstName = firstName;
    };
    getFirstName = function() {
        return this.#firstName;
    };
    setLastName = function(lastName) {
        this.#lastName = lastName;
    };
    getLastName = function() {
        return this.#lastName;
    };
    setEmail = function(email) {
        this.#email = email;
    };
    getEmail = function() {
        return this.#email;
    };
    setCountry = function(country) {
         this.#country = country;
    };
    getCountry = function() {
        return this.#country;
    };
    setPhoneNumber = function(phoneNumber) {
        this.#phoneNumber = phoneNumber;
    };
    getPhoneNumber = function() {
        return this.#phoneNumber;
    };
    removeAccount = function(accountNumber) {
        delete this.#accounts[accountNumber];
    };
    addAccount = function(account) {
        this.#accounts[account.getCode()] = account;
    };
    getAccounts = function() {
        return this.#accounts;
    };
    getAccount = function(accountCode) {
        return this.#accounts[accountCode];
    };
    getCode = function() {
        return this.#code;
    };
    #setCode = function(code) {
        this.#code = code ? code : utils.generateCode(10);
    };

    getData = function(){
        return {
            "firstName"   : this.#firstName,
            "lastName"    : this.#lastName,
            "code"        : this.#code,
            "email"       : this.#email,
            "country"     : this.#country,
            "phoneNumber" : this.#phoneNumber,
            "accounts"    : this.#accounts
        }
    };
};

module.exports = User;