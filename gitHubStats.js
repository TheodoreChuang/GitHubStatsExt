var theUrl =
  "https://api.github.com/repos/TheodoreChuang/TC-Portfolio/stats/contributors";

function callback(res) {
  console.log(res);
  //   parseRes = JSON.parse(res)
}

function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  };
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

// https://stackoverflow.com/questions/247483/http-get-request-in-javascript
