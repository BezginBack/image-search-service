var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var uri = process.env.MONGOLAB_URI;

function insert(item, callback) {
  var collection; 
  MongoClient.connect(uri, function(err, db) {
    if (err) {
      callback(err, null);
    } else {
      collection = db.collection('search_storage');
      collection.insert(item, function(err, res) {
        if (err) callback(err, null);
        callback(null, null);
        db.close();
      });
    }
  });
}

function bring(callback) {
  var collection;
  MongoClient.connect(uri, function(err, db) {
    if (err) {
      callback(err, null);
    } else {
      collection = db.collection('search_storage');
      collection.find().limit(10).toArray(function(err, arr){
        if(err) callback(err, null);
        callback(null, arr);
      });
      db.close();
    }
  });
}

module.exports.insert = insert;
module.exports.bring = bring;