'use strict';

const Mongodb = require('../src');
const { ObjectId } = require('mongodb');

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;


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

describe('test open, use  and close 2', () => {

    it('verifies it should works with collection insert and get operation', async () => {

        const mongodb_url = 'mongodb://localhost';
        const mongodb = new Mongodb(mongodb_url);

        try {
            const database = await mongodb.open('testdb');
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

describe('test open, collection and close 4', () => {

    it('verifies it should works with collection insert and get operation', async () => {

        const mongodb_url = 'mongodb://localhost/testdb';
        const mongodb = new Mongodb(mongodb_url);

        try {
            const collection = await mongodb.collection('test_collection');
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

describe('test getClient with transaction', () => {

    it('verifies it should works with collection insert and get operation', async () => {

        const mongodb_url = 'mongodb://localhost';
        const mongodb = new Mongodb(mongodb_url);
        const collection = await mongodb.open('testdb', 'test_collection');
        const session = mongodb.getClient().startSession();
        try {
            await session.withTransaction(async () => {
                await collection.insertOne({started_at: Date.now(), key: 'test value'});
                const result = await collection.findOne({key: 'test value'});

                assert.isNotNull(result);
                expect(result.key).to.be.an('string');
                expect(result.key).equals('test value');
        
                await collection.deleteMany({key: 'test value'});
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
            await mongodb.close();
        }
    });
});

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
