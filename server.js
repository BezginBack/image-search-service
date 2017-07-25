var express = require("express");
var app = express();
var request = require("request");
var async = require("async");
var cheerio = require("cheerio");

function parseIt(url, callback){
  var data = "";
  var arr = [];
  request(url, function (err, page, body) {
    if (!err && page.statusCode == 200) {
      var $ = cheerio.load(body);
      var data = "";
      for(var j = 0 ; j < $("div").get().length; j++){
        data += $("div").eq(j).text();
      }
      callback(null, body);
    } else {
      callback(null, "err");
    }
  });
}


app.use(express.static('public'));

app.get("/api", function (req, res) {
  if(req.query.imageSearch){
    var q = req.query.imageSearch;
    var url = 'https://www.google.com/search?q='+q;
    res.writeHead(200, {"content-type" : "text/plain"});
    parseIt(url, function(err, data){
      if(err) res.end(err);
      if(data == "err") res.end("error or bad search");
      //res.write(data);
      res.end(data);
    });
  }
});

app.get("/api", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
