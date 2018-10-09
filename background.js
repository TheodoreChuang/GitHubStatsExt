// add event listener to 'Get Stats!' button
document.addEventListener("DOMContentLoaded", function() {
  var gitButton = document.getElementById("gitButton");
  gitButton.addEventListener("click", () => builtGet());
});

// REPOS - build GET request to GitHub API
function builtGet() {
  var gitUser = document.getElementById("gitUser").value;
  var url = `https://api.github.com/users/${gitUser}/repos`;
  // https://api.github.com/repos/TheodoreChuang/TC-Portfolio/commits?since=2018-09-24T16:00:49Z
  //   "https://api.github.com/repos/TheodoreChuang/TC-Portfolio/stats/contributors";
  httpGetAsync(url, processResponse);
}

// REPOS - GET request to GitHub API
function httpGetAsync(url, processResponse) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      processResponse(xmlHttp.responseText);
  };
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
}

// REPOS - process GitHub Response
function processResponse(res) {
  let parseRes = JSON.parse(res);
  let repos = [];
  parseRes.forEach(e => repos.push(e["name"]));
  // console.log(repos);

  // gitStats = gitStats.length;
  // responseOutput(gitStats);
}

// // COMMITS - build GET request to GitHub API
// function builtGet() {
//   var gitUser = document.getElementById("gitUser").value;
//   var url = `https://api.github.com/users/${gitUser}/repos`;
//   // https://api.github.com/repos/TheodoreChuang/TC-Portfolio/commits?since=2018-09-24T16:00:49Z
//   //   "https://api.github.com/repos/TheodoreChuang/TC-Portfolio/stats/contributors";
//   httpGetAsync(url, processResponse);
// }

// // COMMITS - GET request to GitHub API
// function httpGetAsync(url, processResponse) {
//   var xmlHttp = new XMLHttpRequest();
//   xmlHttp.onreadystatechange = function() {
//     if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
//       processResponse(xmlHttp.responseText);
//   };
//   xmlHttp.open("GET", url, true);
//   xmlHttp.send(null);
// }

// // COMMITS - output stats data to popup
// function responseOutput(gitStats) {
//   var gitStats = document.getElementById("gitStats");
//   gitStats.innerHTML = gitStats;
// }

// DONE: GET list of repos
// Get list of commits since xxx hours for each repo?

// chrome.storage username?
// chrome.browserAction.setBadgeText(object details, function callback)
