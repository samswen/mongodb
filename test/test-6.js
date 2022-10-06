'use strict';

const Mongodb = require('../src');
const { ObjectId } = require('mongodb');

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

// stage_env=test mocha --timeout 30000 --reporter spec test/test-6

describe('test string_id', () => {

    it('verifies it should return string id if it is valid', async () => {

        const oid = new ObjectId();
        const sid = oid.toString();

        const mongodb_url = 'mongodb://localhost';
        const mongodb = new Mongodb(mongodb_url);

        const res1 = mongodb.string_id(oid);
        expect(res1).to.be.a('string');
        expect(res1).equals(sid);

        const res2 = mongodb.string_id(sid);
        expect(res2).to.be.a('string');
        expect(res2).equals(sid);

        try {
            mongodb.string_id('not a id');
            assert.fail('failed to catch invalid id');
        } catch(err) {
            assert.ok('OK');
        }
    });
});
