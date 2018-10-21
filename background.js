// Unauthenticated GitHub API limit 60 requests per hour
// API only get from public repos

let commitsPerEachRepo = [];

document.addEventListener("DOMContentLoaded", function() {
  loadUser();
  loadDays();
  loadCommits();
  loadLastCheck();
  setBadge();

  let gitButton = document.getElementById("gitButton");
  gitButton.addEventListener("click", function() {
    if (gitUser.value != "" && sinceDay.value != "") {
      gitButton.setAttribute("disabled", "disabled");
      gitStats.innerHTML = `...scanning...`;
      commitsPerEachRepo = [];
      builtGetUrl();
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
    if (xmlHttp.status == 403) {
      apiLimitError();
    }
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
function builtGetUrlCommits(repos) {
  let gitUser = document.getElementById("gitUser").value;
  let sinceDate = timeSinceDay();
  let promises = [];
  repos.forEach(function(repo) {
    let url = `https://api.github.com/repos/${gitUser}/${repo}/commits?since=${sinceDate}`;
    promises.push(httpGetAsyncCommits(url, processResponseCommits));
  });

  Promise.all(promises)
    .then(responses => {
      console.log(responses);
      responseOutput();
    })
    .catch(err => console.log(err));
}

// COMMITS - GET request to GitHub API
function httpGetAsyncCommits(url, processResponseCommits) {
  return new Promise((resolve, reject) => {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.status == 403) {
        reject(apiLimitError());
      }
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        resolve(processResponseCommits(xmlHttp.responseText));
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
  });
}

// COMMITS - process GitHub Response
function processResponseCommits(res) {
  let parseRes = JSON.parse(res);
  commitsPerEachRepo.push(parseRes);
  // console.log("Process=====");
  // console.log(commitsPerEachRepo);
  return res;
}

function apiLimitError() {
  // console.log("API Limit");
  commitsPerEachRepo = "apiLimitReached";
  responseOutput();
}

// output stats data to popup
function responseOutput() {
  // console.log("resOutput=====");
  let gitUser = document.getElementById("gitUser").value;
  let days = document.getElementById("sinceDay").value;
  let gitStats = document.getElementById("gitStats");
  let lastChecked = document.getElementById("lastChecked");
  let totalCommits = "";

  if (commitsPerEachRepo != "apiLimitReached") {
    totalCommits = commitsPerEachRepo.flat().length;
    if (days == 1) {
      gitStats.innerHTML = `Commits over last 24 hours: <strong>${totalCommits}</strong>`;
    } else {
      gitStats.innerHTML = `Commits over ${days} days: <strong>${totalCommits}</strong>`;
    }
  } else {
    totalCommits = `Sorry! Hourly API Limit of 60 Reached`;
    gitStats.innerHTML = `<strong>${totalCommits}</strong>`;
  }

  let timeNow = new Date().toLocaleTimeString("en-AUS", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  });
  lastChecked.innerHTML = `${timeNow}`;

  saveUser(gitUser);
  saveDays(days);
  saveCommits(totalCommits);
  saveLastCheck(timeNow);
  setBadge();
  gitButton.removeAttribute("disabled");
}

function timeSinceDay() {
  let days = document.getElementById("sinceDay").value;
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
function saveDays(value) {
  chrome.storage.sync.set({ storeDays: value }, function() {
    console.log(`storeDays: ${value}`);
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
    console.log("storeUsername is " + result.storeUsername);
    if (result.storeUsername != undefined) {
      let gitUser = document.getElementById("gitUser");
      gitUser.value = result.storeUsername;
    }
  });
}
function loadDays() {
  chrome.storage.sync.get("storeDays", function(result) {
    console.log("storeDays is " + result.storeDays);
    if (result.storeDays != undefined) {
      let days = document.getElementById("sinceDay");
      days.value = result.storeDays;
    }
  });
}
function loadCommits() {
  chrome.storage.sync.get("storeCommits", function(result) {
    console.log("storeCommits is " + result.storeCommits);
    if (result.storeCommits != undefined) {
      let gitStats = document.getElementById("gitStats");
      if (result.storeCommits != "Sorry! Hourly API Limit of 60 Reached") {
        let days = document.getElementById("sinceDay").value;
        if (days == 1) {
          gitStats.innerHTML = `Commits over 24 hours: <strong>${
            result.storeCommits
          }</strong>`;
        } else {
          gitStats.innerHTML = `Commits over ${days} days: <strong>${
            result.storeCommits
          }</strong>`;
        }
      } else {
        gitStats.innerHTML = `<strong>Sorry! Hourly API Limit of 60 Reached</strong>`;
      }
    }
  });
}
function loadLastCheck() {
  chrome.storage.sync.get("storeLastChecked", function(result) {
    console.log("storeLastChecked is " + result.storeLastChecked);
    if (result.storeLastChecked != undefined) {
      let lastChecked = document.getElementById("lastChecked");
      lastChecked.innerHTML = result.storeLastChecked;
    }
  });
}

// Display and set badge
function setBadge() {
  chrome.storage.sync.get("storeCommits", function(result) {
    if (result.storeCommits != "Sorry! Hourly API Limit of 60 Reached") {
      chrome.browserAction.setBadgeText({
        text: result.storeCommits.toString()
      });
      chrome.browserAction.setBadgeBackgroundColor({ color: "#999999" });
    }
  });
}
