// add event listener to 'Get Stats!' button
document.addEventListener("DOMContentLoaded", function() {
  var gitStatsButton = document.getElementById("gitStats");
  gitStatsButton.addEventListener("click", () => builtGet());
});

// build GET request to GitHub API
function builtGet() {
  var gitUser = document.getElementById("gitUser").value;
  var url = `https://api.github.com/users/${gitUser}/repos`;
  // https://api.github.com/repos/TheodoreChuang/TC-Portfolio/commits?since=2018-09-24T16:00:49Z
  //   "https://api.github.com/repos/TheodoreChuang/TC-Portfolio/stats/contributors";
  httpGetAsync(url, processResponse);
}

// GET request to GitHub API
function httpGetAsync(url, processResponse) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      processResponse(xmlHttp.responseText);
  };
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
}

// process GitHub Response
function processResponse(res) {
  // typeof res == string
  // typeof JSON.parse(res) == object
  // console.log(typeof typeof JSON.parse(res)); == string?

  // console.log(JSON.parse(res));

  let gitStats = JSON.parse(res);

  responseOutput(gitStats.length);
}

// Output Stats Data to popup
function responseOutput(gitStats) {
  var gitStats = document.createElement("div");
  gitStats.innerHTML = gitStats;
  document.body.appendChild(gitStats);
}

// GET list of repos
// Get list of commits since xxx hours for each repo?

// chrome.storage username?
// chrome.browserAction.setBadgeText(object details, function callback)
