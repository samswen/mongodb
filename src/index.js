'use strict';

const MongoClient = require('mongodb').MongoClient;

class Mongodb {
    constructor(url) {
        this.url = url;
        this.client = null;
        this.db = null;
    }

    async open() {
        if (this.db && this.client) {
            return this.db;
        }
        this.client = await MongoClient.connect(this.url, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
        });
        this.db = this.client.db();
        return this.db;
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