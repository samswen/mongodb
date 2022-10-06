'use strict';

const Mongodb = require('../src');

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

// stage_env=test mocha --timeout 30000 --reporter spec test/test-4

describe('test open, use and close 3', () => {

    it('verifies it should works with collection insert and get operation', async () => {

        const mongodb_url = 'mongodb://localhost';
        const mongodb = new Mongodb(mongodb_url);

        try {
            const collection = await mongodb.open('testdb', 'test_collection');
            await collection.insertOne({started_at: Date.now(), key: 'test value'});
            const result = await collection.findOne({key: 'test value'});

            assert.isNotNull(result);
            expect(result.key).to.be.an('string');
            expect(result.key).equals('test value');
    
            await collection.deleteMany({key: 'test value'});

        } catch(err) {
            console.error(err);
            assert.fail(err.message);
        } finally {
            await mongodb.close();
        }
    });
});