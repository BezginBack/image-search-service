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

function getIt(url, callback){
  request(url, function (err, page, body) {
    if (!err && page.statusCode == 200) {
      var obj = JSON.parse(body);
      var d = new Date();
      var m = parseInt(d.getMonth());
      var data = {
        term : obj.queries.request[0].searchTerms,
        time : d.getDate() + "." + (m + 1) + "." + d.getFullYear() + ", " + d.getHours() + ":" + d.getMinutes()
      };
      callback(null, data);
    } else {
      callback(err + ' ' + page.statusCode, null);
    }
  });
}

module.exports.parseIt = parseIt;
module.exports.getIt = getIt;