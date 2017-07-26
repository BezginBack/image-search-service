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

function bring(url, callback) {
  var collection;
  MongoClient.connect(url, function(err, db) {
    if (err) {
      callback(null, "err1");
    } else {
      collection = db.collection('url_storage');
      collection.find().sort({$natural:-1}).limit(1).next(function(err, obj){
        if(err) callback(null, "err3");
        callback(null, JSON.stringify({
          oldUrl : obj.url,
          newUrl : "https://url-sh-srv.glitch.me/" + obj.number
        }));  
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