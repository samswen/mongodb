'use strict';

const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

class Mongodb {
    constructor(url = 'mongodb://127.0.0.1', minSize = 2, poolSize = 16) {
        this.url = url;
        this.minSize = minSize;
        this.poolSize =  poolSize;
        this.client = null;
        this.database = null;
        this.dbName = null;
    }

    async open(dbName = null, cName = null) {
        const database = await this.db(dbName);
        if (cName) {
            return database.collection(cName);
        } else {
            return database;
        }
    }

    async db(dbName = null) {
        if (this.client && this.database && this.dbName === dbName) {
            return this.database;
        }
        if (!this.client) {
            this.client = await MongoClient.connect(this.url, { 
                useUnifiedTopology: true,
                minPoolSize: this.minSize,
                maxPoolSize: this.poolSize,
            });
        }
        if (dbName && this.dbName !== dbName) {
            this.dbName = dbName;
            this.database = this.client.db(dbName);
        }
        if (!this.database) {
            this.database = this.client.db();
        }
        return this.database;
    }

    async collection(cName) {
        const database = await this.db();
        return database.collection(cName);
    }
    
    async listDbs() {
        if (!this.database) {
            await this.open();
        }
        return await this.database.admin().listDatabases();
    }

    async list_collections(dbName) {
        const database = await this.db(dbName);
        const collections = await database.listCollections().toArray();
        const list = [];
        for (const item of collections) {
            if (item.type === 'collection') {
                list.push(item.name);
            }
        }
        return list;
    }
    
    async has_collection(dbName, name) {
        const database = await this.db(dbName);
        const collections = await database.listCollections().toArray();
        const index = collections.findIndex(x => x.name === name);
        if (index === -1) {
            return false;
        } else {
            return true;
        }
    }

    async close() {
        this.database = null;
        if (this.client) {
            try {
                await this.client.close();
                this.client = null;
            } catch (err) {
                console.error(err);
            }
        }
    }

    getClient() {
        return this.client;
    }

    string_id(any_id) {
        return Mongodb.stringId(any_id);
    }

    object_id(any_id) {
        return Mongodb.objectId(any_id);
    }

    static stringId(any_id) {
        if (ObjectId.isValid(any_id)) {
            if (typeof any_id === 'string') {
                return any_id;
            } else {
                return any_id.toString();
            }
        }
        throw Error('invalid object id');
    }

    static objectId(any_id) {
        if (ObjectId.isValid(any_id)) {
            if (typeof any_id === 'string') {
                return new ObjectId(any_id);
            } else {
                return any_id;
            }
        }
        throw Error('invalid object id');
    }
}

module.exports = Mongodb;