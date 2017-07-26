var express = require("express");
var app = express();
var op = require("./operate.js");
var re = require("./request.js");

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
    re.getIt(url, function(err, item){
      if(err) res.end("err " + err);
      op.insert(item, function(err, res){
        if (err) res.end(err);  
      });
    });
    re.parseIt(url, limit, function(err, data){
      if(err) res.end("err " + err);
      res.end(JSON.stringify(data));
    });
  } else {
    res.sendFile(__dirname + '/views/index.html');  
  }
});

app.get("/api/latest/imagesearch", function (req, res) {
  op.bring(function(err, arr){
    if(err) res.end(err);
    for(var i = 0; i < arr.length; i++){
      res.json({
        term : arr[i].term,
        time : arr[i].time
      });
    }
    res.end();
  });
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
