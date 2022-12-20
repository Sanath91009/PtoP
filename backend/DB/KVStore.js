const client = require("./../HTTP/DB-kv");

function KVSet(key, value, expiryTime) {
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      const db = client.db('myFirstDatabaset');
      const collection = db.collection('documents');
      const insertResult = await collection.insertMany([{key}]);
      console.log('Inserted documents =>', insertResult);
      resolve()
    } catch (err) {
      err.srvMessage = "Error while SETting redis";
      reject(err)
    }
  });
}

function KVGet(key) {
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      const db = client.db('myFirstDatabaset');
      const collection = db.collection('documents');
      const filteredDocs = await collection.find({ key }).toArray();
      resolve(1);
    } catch (err) {
      err.srvMessage = "Error while GETting redis";
      reject(err)
    }

  });
}

function KVDel(key) {
  return new Promise((resolve, reject) => {
    redisClient.DEL(key, (err, reply) => {
      if (err) {
        err.srvMessage = "Error while DELting redis";
        reject(err);
      }
      return resolve(reply);
    });
  });
}

module.exports = {
  KVSet,
  KVGet,
  KVDel
};