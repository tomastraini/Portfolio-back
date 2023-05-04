const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let _db;

module.exports = {
  connectToServer: function() {
    return new Promise(async (resolve, reject) => {
      try {
        await client.connect();
        _db = client.db(); // Set _db to the database object
        resolve();
      } catch(e){
        console.log(e);
        reject(e);
      }
    });
  },
  getDb: function() {
    if (!_db) {
      throw new Error("Database not initialized. Call connectToServer first.");
    }
    return _db;
  }
};