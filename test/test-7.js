'use strict';

const Mongodb = require('../src');
const { ObjectId } = require('mongodb');

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

// stage_env=test mocha --timeout 30000 --reporter spec test/test-7

describe('test object_id', () => {

    it('verifies it should return object id if it is valid', async () => {

        const oid = new ObjectId();
        const sid = oid.toString();

        const mongodb_url = 'mongodb://localhost';
        const mongodb = new Mongodb(mongodb_url);

        const res1 = mongodb.object_id(oid);
        expect(res1).to.be.a('object');
        assert.isTrue(res1.equals(oid));

        const res2 = mongodb.object_id(sid);
        expect(res2).to.be.a('object');
        assert.isTrue(res2.equals(oid));

        try {
            mongodb.object_id('not a id');
            assert.fail('failed to catch invalid id');
        } catch(err) {
            assert.ok('OK');
        }
    });
});
