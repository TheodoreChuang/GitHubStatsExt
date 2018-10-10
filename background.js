// Unauthenticated GitHub API limit 60 per hour

let commitsPerEachRepo = [];

document.addEventListener("DOMContentLoaded", function() {
  loadUser();
  loadCommits();
  loadLastCheck();
  // add event listener to 'Get Stats!' button
  let gitButton = document.getElementById("gitButton");
  // FIXME - handle async callback - temporarily patched with setTimeout
  gitButton.addEventListener("click", function() {
    if (gitUser.value != "") {
      commitsPerEachRepo = [];
      builtGetUrl(responseOutput(commitsPerEachRepo));
    }
  });
});

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
    // if (xmlHttp.status == 403 || xmlHttp.status == 404) {
    //   let gitStats = document.getElementById("gitStats");
    //   gitStats.innerHTML = `Hourly API Limit Reached!`;
    // }
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
    // if (xmlHttp.status == 403 || xmlHttp.status == 404) {
    //   let gitStats = document.getElementById("gitStats");
    //   gitStats.innerHTML = `Hourly API Limit Reached!`;
    // }
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
  commitsPerEachRepo.push(parseRes);
  console.log(commitsPerEachRepo);
}

// output stats data to popup
function responseOutput(commitsPerEachRepo) {
  setTimeout(function() {
    console.log("resOutput=====");
    let totalCommits = commitsPerEachRepo.flat().length;
    let gitStats = document.getElementById("gitStats");
    gitStats.innerHTML = `Commits last 24 hours: <strong>${totalCommits}</strong>`;

    let lastChecked = document.getElementById("lastChecked");
    let timeNow = new Date().toLocaleTimeString();
    lastChecked.innerHTML = `${timeNow}`;

    let gitUser = document.getElementById("gitUser").value;
    saveUser(gitUser);
    saveCommits(totalCommits);
    saveLastCheck(timeNow);
  }, 8000);
}

function timeSinceDay(days = 1) {
  const millisecondsPerDay = 86400000;
  let dayAgo = new Date(new Date() - days * millisecondsPerDay);
  return dayAgo.toISOString();
}

// Save sync/local data
function saveUser(value) {
  chrome.storage.sync.set({ storeUsername: value }, function() {
    console.log(`storeUsername: ${value}`);
  });
}
function saveCommits(value) {
  chrome.storage.sync.set({ storeCommits: value }, function() {
    console.log(`storeCommits: ${value}`);
  });
}
function saveLastCheck(value) {
  chrome.storage.sync.set({ storeLastChecked: value }, function() {
    console.log(`storeLastChecked: ${value}`);
  });
}

// Load saved sync/local data
function loadUser() {
  chrome.storage.sync.get("storeUsername", function(result) {
    console.log("storeUsername currently is " + result.storeUsername);
    if (result.storeUsername != undefined) {
      let gitUser = document.getElementById("gitUser");
      gitUser.value = result.storeUsername;
    }
  });
}
function loadCommits() {
  chrome.storage.sync.get("storeCommits", function(result) {
    console.log("storeCommits currently is " + result.storeCommits);
    if (result.storeCommits != undefined) {
      let gitStats = document.getElementById("gitStats");
      gitStats.innerHTML = `Commits last 24 hours: <strong>${
        result.storeCommits
      }</strong>`;
    }
  });
}
function loadLastCheck() {
  chrome.storage.sync.get("storeLastChecked", function(result) {
    console.log("storeLastChecked currently is " + result.storeLastChecked);
    if (result.storeLastChecked != undefined) {
      let lastChecked = document.getElementById("lastChecked");
      lastChecked.innerHTML = result.storeLastChecked;
    }
  });
}

// // For Testing:
// function builtGetUrl() {
//   setTimeout(function() {
//     console.log("get");
//     commitsPerEachRepo = [[], [], [], [], [{ a: 1 }, { b: 2 }]];
//     console.log(commitsPerEachRepo);
//   }, 1000);
// }
// function responseOutput() {
//   setTimeout(function() {
//     console.log("res");
//     console.log(commitsPerEachRepo);
//     let totalCommits = commitsPerEachRepo.flat().length;
//     console.log("res2");
//     let gitStats = document.getElementById("gitStats");
//     gitStats.innerHTML = `Commits last 24 hours: <strong>${totalCommits}</strong>`;

//     let lastChecked = document.getElementById("lastChecked");
//     let timeNow = new Date().toLocaleTimeString();
//     lastChecked.innerHTML = `${timeNow}`;

//     let gitUser = document.getElementById("gitUser").value;
//     saveUser(gitUser);
//     saveCommits(totalCommits);
//     saveLastCheck(timeNow);
//   }, 2000);
// }
