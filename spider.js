
var nodes = chrome.storage.local;
var pmarks = chrome.storage.sync;


// TODO: Implement user interface and let user save pathmark as something -
// that thing is then the key to a storage.sync object which contains the pathmark

// Function that take a url and creates a pathmark by tracing
// referring urls back to the empty string and saving them to sync storage
var savePath = function (myUrl) {
  if (myUrl) {
    nodes.get(myUrl, function (urlObj) {
      var edges = urlObj[myUrl];
      if (edges) {
        var node = {};
        node[myUrl] = edges;
        pmarks.set(node);
        edges.forEach(function (element, index, array) {
          savePath(element.in_node);
        });
      }
    });
  }
}

// Get active tab url and save pathmark to sync storage
var pmarkByLink = function () {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    console.log(tabs);
    var url = tabs[0].url;
    console.log(url);
    var stripped = url.substr(url.indexOf(':') + 1);
    savePath(stripped);
  });
}


var buildMenu =  function (divName) {
  var menu = document.getElementById(divName);
  var anchors = menu.getElementsByTagName('a');
  for (var i = 0; i < anchors.length; ++i) {
    anchors[i].addEventListener('click', pmarkByLink, false);
  }
}

var microsecondsPerHour = 1000 * 60 * 60;
var oneHourAgo = (new Date).getTime() - microsecondsPerHour;

document.addEventListener('DOMContentLoaded', function () {
 buildMenu('menu');
});
