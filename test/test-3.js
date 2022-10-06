'use strict';

const Mongodb = require('../src');

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;


// stage_env=test mocha --timeout 30000 --reporter spec test/test-3

describe('list database', () => {

    it('verifies it should works with list of databases', async () => {

        const mongodb_url = 'mongodb://localhost';
        const mongodb = new Mongodb(mongodb_url);

        try {
            const result = await mongodb.listDbs();
            assert.isNotNull(result);
            expect(result.databases).to.be.an('array');
            expect(result.databases.length).greaterThan(0);

        } catch(err) {
            console.error(err);
            assert.fail(err.message);
        } finally {
            await mongodb.close();
        }
    });
});