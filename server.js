var express = require("express");
var app = express();
var request = require("request");
var fs = require("fs");

function parseIt(url, l, callback){
  request(url, function (err, page, body) {
    if (!err && page.statusCode == 200) {
      var obj = JSON.parse(body);
      var data = {
        item : []
      };
      var limit = 0;
      if(l > 0){
        limit = l;
        if(l > 10){
          limit = 10;
        }
      } else {
        limit = obj.items.length;
      }
      for (var i = 0; i < limit; i++){
        data.item.push({
          url : obj.items[i].pagemap.imageobject[0].url,
          snippet : obj.items[i].snippet,
          link : obj.items[i].link
        });
      } 
      callback(null, data);
    } else {
      callback(err + ' ' + page.statusCode, null);
    }
  });
}

app.get("/whoami", function (req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  ip = ip.split(",")[0];
  var language = req.headers['accept-language'].split(",")[0];
  var browser = req.headers['user-agent']
  var d = new Date();
  var m = parseInt(d.getMonth());
  var json = JSON.stringify({
            ip: ip,
            lang: language,
            browser: browser,
            time: d.getDate() + "." + (m + 1) + "." + d.getFullYear() + ", " + d.getHours() + ":" + d.getMinutes()
        });
  var filePath = __dirname + '/log.txt';
  fs.appendFile(filePath, json + "\n", function(err){
    if (err) res.end(err);
    res.writeHead(200, {"content-type" : "text/plain"});
    res.end(json);
  });
});

app.use(express.static('public'));

app.get("/api", function (req, res) {
  if(req.query.imageSearch){
    var limit = 0;
    if(req.query.offset){
      limit = req.query.offset 
    }
    var q = req.query.imageSearch;
    var url = 'https://www.googleapis.com/customsearch/v1?cx='+ process.env.ID + '&key=' + process.env.KEY + '&q=' + q;
    res.writeHead(200, {"content-type" : "text/plain"});
    parseIt(url, limit, function(err, data){
      if(err) res.end("err " + err);
      res.end(JSON.stringify(data));
    });
  } else {
    res.sendFile(__dirname + '/views/index.html');  
  }
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
