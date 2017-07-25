var express = require("express");
var app = express();
var request = require("request");

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
