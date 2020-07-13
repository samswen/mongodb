'use strict';

const MongoClient = require('mongodb').MongoClient;

class Mongodb {
    constructor(url, minSize = 4, poolSize = 16) {
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
                minSize: this.minSize,
                poolSize: this.poolSize,
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
}

module.exports = Mongodb;