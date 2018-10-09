// Unauthenticated GitHub API limit 60 per hour

let commitsPerEachRepo = [];

// add event listener to 'Get Stats!' button
document.addEventListener("DOMContentLoaded", function() {
  let gitButton = document.getElementById("gitButton");
  // FIXME - handle async callback
  gitButton.addEventListener("click", () => responseOutput(builtGetUrl()));
});

// function builtGetUrl() {
//   setTimeout(function() {
//     console.log("get");
//     commitsPerEachRepo = [[], [], [], [], [{ a: 1 }, { b: 2 }]];
//     console.log(commitsPerEachRepo);
//     return commitsPerEachRepo;
//   }, 5000);
// }

// function responseOutput(data) {
//   console.log("res");
//   console.log(commitsPerEachRepo);
//   let total = data.flat().length;
//   console.log("res2");
//   let gitStats = document.getElementById("gitStats");
//   gitStats.innerHTML = `Your total GitHub commits in the last 24 hours: ${total}`;
// }

// REPOS - build GET request to GitHub API
function builtGetUrl() {
  let gitUser = document.getElementById("gitUser").value;
  let url = `https://api.github.com/users/${gitUser}/repos`;
  httpGetAsync(url, processResponse);
}

// REPOS - GET request to GitHub API
function httpGetAsync(url, processResponse) {
  let xmlHttp = new XMLHttpRequest();
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
  builtGetUrlCommits(repos);
}

// COMMITS - build GET request to GitHub API
function builtGetUrlCommits(repos, days) {
  let gitUser = document.getElementById("gitUser").value;
  let sinceDate = timeSinceDay(days);
  repos.forEach(function(repo) {
    let url = `https://api.github.com/repos/${gitUser}/${repo}/commits?since=${sinceDate}`;
    httpGetAsyncCommits(url, processResponseCommits);
  });
}

// COMMITS - GET request to GitHub API
function httpGetAsyncCommits(url, processResponseCommits) {
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      processResponseCommits(xmlHttp.responseText);
  };
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
}

// COMMITS - process GitHub Response
function processResponseCommits(res) {
  let parseRes = JSON.parse(res);
  console.log("Process=====");
  // console.log(parseRes);
  commitsPerEachRepo.push(parseRes);
}

// output stats data to popup
function responseOutput(commitsPerEachRepo) {
  console.log("resOutput=====");
  console.log(commitsPerEachRepo);
  let totalCommits = commitsPerEachRepo.flat().length;
  console.log("TotalCommits=====");
  console.log(totalCommits);
  let gitStats = document.getElementById("gitStats");
  gitStats.innerHTML = `Your total GitHub commits in the last 24 hours: ${totalCommits}`;
}

function timeSinceDay(days = 1) {
  const millisecondsPerDay = 86400000;
  let dayAgo = new Date(new Date() - days * millisecondsPerDay);
  return dayAgo.toISOString();
}
