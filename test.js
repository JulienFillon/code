/*
    This is the file handling the tests
    I used Jest to do it
    It allow to test every single api endpoints
*/
const server = require('./server.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(server);


describe('User Endpoints', () => {

    it('GET /getUserInfos -> NO USER CODE -> should return error', async () => {
        const res =  await requestWithSupertest.get('/getUserInfos');
        expect(res.status).toEqual(500);
        expect(res.error.text).toEqual('missing userCode data');
    });

    it('GET /getUserInfos -> BAD USER CODE -> should return error', async () => {
        const res =  await requestWithSupertest.get('/getUserInfos').send({ userCode: 'BADUSERCODE' });
        expect(res.status).toEqual(502);
        expect(res.error.text).toEqual('user not found');
    });

    it('GET /getUserInfos -> GOOD REQUEST -> should return user infos', async () => {
        const res =  await requestWithSupertest.get('/getUserInfos').send({ userCode: 'A89TY8M640' });
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('accounts');
        expect(res.body).toHaveProperty('user');
    });
});

describe('Account Endpoints', () => {

    describe('getAccount', () => {
        it('GET /getAccount -> NO PARAMETERS-> should return error', async () => {
            const res =  await requestWithSupertest.get('/getAccount');
            expect(res.status).toEqual(500);
            expect(res.error.text).toEqual('missing code data');
        });
        it('GET /getAccount -> BAD ACOUNT CODE -> should return error', async () => {
            const res =  await requestWithSupertest.get('/getAccount').send({ code: 'BADCODE' });
            expect(res.status).toEqual(500);
            expect(res.error.text).toEqual('account not found');
        });
        it('GET /getAccount -> GOOD REQUEST -> should return account infos', async () => {
            const res =  await requestWithSupertest.get('/getAccount').send({ code: 'DHFSF4D6SF' });
            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty('balance');
            expect(res.body).toHaveProperty('code');
            expect(res.body).toHaveProperty('name');
            expect(res.body).toHaveProperty('openingDate');
            expect(res.body).toHaveProperty('currency');
        });
    });

    describe('debitAccountBalance', () => {
        it('POST /debitAccountBalance -> NO PARAMETERS -> should return error', async () => {
            const res =  await requestWithSupertest.post('/debitAccountBalance');
            expect(res.status).toEqual(500);
            expect(res.error.text).toEqual('missing code data');
        });
        it('POST /debitAccountBalance -> NO VALUE -> should return error', async () => {
            const res =  await requestWithSupertest.post('/debitAccountBalance').send({ code: 'BADCODE' });
            expect(res.status).toEqual(500);
            expect(res.error.text).toEqual('missing value data');
        });
        it('POST /debitAccountBalance -> BAD ACOUNT CODE -> should return error', async () => {
            const res =  await requestWithSupertest.post('/debitAccountBalance').send({ code: 'BADCODE', value:100 });
            expect(res.status).toEqual(500);
            expect(res.error.text).toEqual('account not found');
        });
        it('POST /debitAccountBalance -> BAD VALUE CODE -> should return error', async () => {
            const res =  await requestWithSupertest.post('/debitAccountBalance').send({ code: 'DHFSF4D6SF', value:"test" });
            expect(res.status).toEqual(500);
            expect(res.error.text).toEqual('value is not a number');
        });
        it('POST /debitAccountBalance -> GOOD REQUEST -> should return OK', async () => {
            const res =  await requestWithSupertest.post('/debitAccountBalance').send({ code: 'DHFSF4D6SF', value:100});
            expect(res.status).toEqual(200);
            expect(res.text).toEqual(expect.stringContaining('OK'));
        });
    });

    describe('creditAccountBalance', () => {
        it('POST /creditAccountBalance -> NO PARAMETERS -> should return error', async () => {
            const res =  await requestWithSupertest.post('/creditAccountBalance');
            expect(res.status).toEqual(500);
            expect(res.error.text).toEqual('missing code data');
        });
        it('POST /creditAccountBalance -> NO VALUE -> should return error', async () => {
            const res =  await requestWithSupertest.post('/creditAccountBalance').send({ code: 'BADCODE' });
            expect(res.status).toEqual(500);
            expect(res.error.text).toEqual('missing value data');
        });
        it('POST /creditAccountBalance -> BAD ACOUNT CODE -> should return error', async () => {
            const res =  await requestWithSupertest.post('/creditAccountBalance').send({ code: 'BADCODE', value:100 });
            expect(res.status).toEqual(500);
            expect(res.error.text).toEqual('account not found');
        });
        it('POST /creditAccountBalance -> BAD VALUE CODE -> should return error', async () => {
            const res =  await requestWithSupertest.post('/creditAccountBalance').send({ code: 'DHFSF4D6SF', value:"test" });
            expect(res.status).toEqual(500);
            expect(res.error.text).toEqual('value is not a number');
        });
        it('POST /creditAccountBalance -> GOOD REQUEST -> should return OK', async () => {
            const res =  await requestWithSupertest.post('/creditAccountBalance').send({ code: 'DHFSF4D6SF', value:100});
            expect(res.status).toEqual(200);
            expect(res.text).toEqual(expect.stringContaining('OK'));
        });
    });

    describe('addAccount', () => {
        it('POST /account -> NO PARAMETERS -> should return error', async () => {
            const res =  await requestWithSupertest.post('/account');
            expect(res.status).toEqual(500);
            expect(res.error.text).toEqual('missing userCode data');
        });
        it('POST /account -> NO initialCredit -> should return error', async () => {
            const res =  await requestWithSupertest.post('/account').send({ userCode: 'A89TY8M640' });
            expect(res.status).toEqual(500);
            expect(res.error.text).toEqual('missing initialCredit data');
        });
        it('POST /account -> NO initialAccountCode -> should return error', async () => {
            const res =  await requestWithSupertest.post('/account').send({ userCode: 'A89TY8M640', initialCredit:100 });
            expect(res.status).toEqual(500);
            expect(res.error.text).toEqual('missing initialAccountCode data');
        });
        it('POST /account -> BAD USER CODE -> should return error', async () => {
            const res =  await requestWithSupertest.post('/account').send({ userCode: 'BADCODE', initialCredit:100, initialAccountCode : "DHFSF4D6SF" });
            expect(res.status).toEqual(500);
            expect(res.error.text).toEqual('user not found');
        });
        it('POST /account -> BAD initialCredit Value -> should return error', async () => {
            const res =  await requestWithSupertest.post('/account').send({ userCode: 'A89TY8M640', initialCredit:-100, initialAccountCode : "DHFSF4D6SF" });
            expect(res.status).toEqual(500);
            expect(res.error.text).toEqual('initialCredit need to be a positive number');
        });
        it('POST /account -> BAD initialAccountCode CODE -> should return error', async () => {
            const res =  await requestWithSupertest.post('/account').send({ userCode: 'A89TY8M640', initialCredit:100, initialAccountCode : "BADCODE" });
            expect(res.status).toEqual(500);
            expect(res.error.text).toEqual('can not find the origin account');
        });
        it('POST /account -> GOOD REQUEST -> should return OK', async () => {
            const res =  await requestWithSupertest.post('/account').send({ userCode: 'A89TY8M640', initialCredit:100, initialAccountCode : "DHFSF4D6SF" });
            expect(res.status).toEqual(200);
            expect(res.text).toEqual(expect.stringContaining('OK'));
        });
    });

    describe('Transaction Endpoints', () => {

        var transactionCode = null;
        describe('getPendingTransactions', () => {
            it('GET /getPendingTransactions -> GOOD REQUEST -> should return pending transactions', async () => {
                const res =  await requestWithSupertest.get('/getPendingTransactions');
                expect(res.status).toEqual(200);
                expect(res.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            wording     : 'TEST transaction',
                            date        : '24/10/2022',
                            credit      : '500',
                            fromAccount : 'DHFSF4D6SF',
                            toAccount   : 'DB7845DF23',
                            status      : 'CREATED',
                            code        : expect.any(String),
                            currency    : 'EUR',
                            reason      : null
                        })
                    ]));

                transactionCode = res.body[0].code;
            });
        });

        // here i am not testing the status, we could imagine checking a status is in a list of predefined one
        describe('updateTransaction', () => {
            it('POST /updateTransaction -> NO PARAMETERS -> should return error', async () => {
                const res =  await requestWithSupertest.post('/updateTransaction');
                expect(res.status).toEqual(500);
                expect(res.error.text).toEqual('missing code data');
            });
            it('POST /updateTransaction -> NO STATUS PARAMETER -> should return error', async () => {
                const res =  await requestWithSupertest.post('/updateTransaction').send({ code: "BADCODE" });
                expect(res.status).toEqual(500);
                expect(res.error.text).toEqual('missing status data');
            });
            it('POST /updateTransaction -> NO TRANSACTION PARAMETER -> should return error', async () => {
                const res =  await requestWithSupertest.post('/updateTransaction').send({ code: "BADCODE", status: 'EXECUTED' });
                expect(res.status).toEqual(500);
                expect(res.error.text).toEqual('transaction not found');
            });
            it('POST /updateTransaction -> GOOD REQUEST  -> should return OK', async () => {
                const res =  await requestWithSupertest.post('/updateTransaction').send({ code: transactionCode, status: 'EXECUTED',  message:"THIS IS A TEST" });
                expect(res.status).toEqual(200);
                expect(res.text).toEqual(expect.stringContaining('OK'));
            });
        });
    });


});