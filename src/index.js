'use strict';

const MongoClient = require('mongodb').MongoClient;

class Mongodb {
    constructor(url, minSize = 4, poolSize = 16) {
        this.url = url;
        this.minSize = minSize;
        this.poolSize =  poolSize;
        this.client = null;
        this.db = null;
        this.dbName = null;
    }

    async open(dbName = null, cName = null) {
        if (this.db && this.client && this.dbName === dbName) {
            if (cName) {
                return this.db.collection(cName);
            } else {
                return this.db;
            }
        }
        if (!this.client) {
            this.client = await MongoClient.connect(this.url, { 
                useUnifiedTopology: true,
                minSize: this.minSize,
                poolSize: this.poolSize,
            });
        }
        this.dbName = dbName;
        this.db = this.client.db(dbName);
        if (cName) {
            return this.db.collection(cName);
        } else {
            return this.db;
        }
    }

    async collection(cName) {
        if (this.db && this.client) {
            return this.db.collection(cName);
        }
        if (!this.client) {
            this.client = await MongoClient.connect(this.url, { 
                useUnifiedTopology: true,
                minSize: this.minSize,
                poolSize: this.poolSize,
            });
        }
        this.db = this.client.db();
        return this.db.collection(cName);
    }
    
    async listDbs() {
        if (!this.db) {
            await this.open();
        }
        return await this.db.admin().listDatabases();
    }

    async close() {
        this.db = null;
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
}

module.exports = Mongodb;