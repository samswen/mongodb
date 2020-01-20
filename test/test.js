'use strict';

const Mongodb = require('../src');

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

const mongodb_url = 'mongodb://localhost/testdb?tls=false';

describe('test open and close', () => {

    it('verifies it should works with collection insert and get operation', async () => {

        const mongodb = new Mongodb(mongodb_url);
        const database = await mongodb.open();

        try {
            await database.collection('test_collection').insertOne({started_at: Date.now(), key: 'test value'});
            const result = await database.collection('test_collection').findOne({key: 'test value'});

            assert.isNotNull(result);
            expect(result.key).to.be.an('string');
            expect(result.key).equals('test value');
    
            await database.collection('test_collection').deleteMany({key: 'test value'});

        } catch(err) {
            console.error(err);
            assert.fail(err.message);
        }
        await mongodb.close();
    });
});

describe('test getClient with transaction', () => {

    it('verifies it should works with collection insert and get operation', async () => {

        const mongodb = new Mongodb(mongodb_url);
        const database = await mongodb.open();
        const session = mongodb.getClient().startSession();
        try {
            await session.withTransaction(async () => {
                await database.collection('test_collection').insertOne({started_at: Date.now(), key: 'test value'});
                const result = await database.collection('test_collection').findOne({key: 'test value'});

                assert.isNotNull(result);
                expect(result.key).to.be.an('string');
                expect(result.key).equals('test value');
        
                await database.collection('test_collection').deleteMany({key: 'test value'});
            }, {
                readPreference: 'primary',
                readConcern: { level: 'local' },
                writeConcern: { w: 'majority' }
            });
        } catch(err) {
            console.error(err);
            assert.fail(err.message);
        } finally {
            await session.endSession();
        }
        await mongodb.close();
    });
});