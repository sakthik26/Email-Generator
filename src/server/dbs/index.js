const MongoClient = require('mongodb').MongoClient

//URL connection string - MongoDB Atlas
const connectionString = "mongodb+srv://sakthi:root@cluster0.pshux.mongodb.net/email_generator?retryWrites=true&w=majority"


let db;

const loadDB = async () => {
    if (db) {
        return db;
    }
    try {
        const client = await MongoClient.connect(connectionString);
        db = client.db('email_generator');
    } catch (err) {
        console.error(err);
    }
    return db;
};

module.exports = loadDB;