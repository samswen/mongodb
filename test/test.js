'use strict';

const Mongodb = require('../src');

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