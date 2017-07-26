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
      collection.find().limit(10).next(function(err, obj){
        if(err) callback(err, null);
        //callback(null, JSON.stringify({
          //term : obj.term,
          //time : obj.time
        //}));
        callback(null, obj.length);
      });
      db.close();
    }
  });
}

function where(url, key, callback) {
  var collection;
  MongoClient.connect(url, function(err, db) {
    if (err) {
      callback(null, "err1");
    } else {
      collection = db.collection('url_storage');
      collection.find({ number : key }).next(function(err, obj){
        if(err) callback(null, "err4");
        if(obj){
          callback(null, obj.url); 
        } else {
          callback(null, "err5");
        }
      });
      db.close();
    }
  });
}

module.exports.insert = insert;
module.exports.bring = bring;
module.exports.where = where;