'use strict';

const Mongodb = require('../src');

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

// stage_env=test mocha --timeout 30000 --reporter spec test/test-1

describe('test open, use and close 1', () => {

    it('verifies it should works with collection insert and get operation', async () => {

        const mongodb_url = 'mongodb://localhost/testdb?tls=false';
        const mongodb = new Mongodb(mongodb_url);

        try {
            const database = await mongodb.open();
            await database.collection('test_collection').insertOne({started_at: Date.now(), key: 'test value'});
            const result = await database.collection('test_collection').findOne({key: 'test value'});

            assert.isNotNull(result);
            expect(result.key).to.be.an('string');
            expect(result.key).equals('test value');
    
            await database.collection('test_collection').deleteMany({key: 'test value'});

        } catch(err) {
            console.error(err);
            assert.fail(err.message);
        } finally {
            await mongodb.close();
        }
    });
});
