# mongodb

A Mongodb class for basic open close getClient operations

## how to install

    npm install @samwen/mongodb

## how to use

    const Mongodb = require('@samwen/mongodb');

    const mongodb_url = 'mongodb://username:password@database.domain.com/database?tls=true';
    
    const mongodb = new Mongodb(mongodb_url)
    try {
        const database = await mongodb.open();
        await database.collection('test_collection').insertOne({started_at: Date.now(), key: 'test value'});
    } catch(err) {
        console.error(err);
    } finally {
        await mongodb.close();
    }

## note

in order to use mongodb_url in the specified format, you must create user under the database:

    mongo shell commands:
    use testdb
    db.createUser({
        user: "testDbUser",
        pwd: "......",
        roles: [ { role: "readWrite", db: "testdb" } ]
    })
