
var nodes = chrome.storage.local;
var pmarks = chrome.storage.sync;
var pathmark = {};
var saveCount = 0;

// TODO: Implement user interface and let user save pathmark as something -
// that thing is then the key to a storage.sync object which contains the pathmark

// Function that take a url and creates a pathmark by tracing
// referring urls back to the empty string and saving them to sync storage
var savePath = function (myUrl, mark_name) {
  saveCount++;
  if (myUrl) {
    nodes.get(myUrl, function (urlObj) {
      var edges = urlObj[myUrl];
      if (edges) {
        var node = {};
        node[myUrl] = edges;
        if ( $.isEmptyObject(pathmark) === false ) {
          pathmark[mark_name].push(node)
        }
        else {
          pathmark[mark_name] = [node];
        }
        edges.forEach(function (element, index, array) {
          savePath(element.in_node, mark_name);
        });
      }
      saveCount--;  
      if (saveCount == 0) {
        console.log(pathmark);
        pmarks.set(pathmark);
      }
    });
  }
}

// Get active tab url and save pathmark to sync storage
var pmarkByLink = function () {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var title = tabs[0].title;
    var url = tabs[0].url;
    var stripped = url.substr(url.indexOf(':') + 1);
    //window.location.replace("add_mark.html");
    //$("#title").val(title)
    savePath(stripped, title);
  });
}

var buildMenu =  function (divName) {
  var menu = document.getElementById(divName);
  var anchors = menu.getElementsByTagName('a');
  for (var i = 0; i < anchors.length; ++i) {
    anchors[i].addEventListener('click', function () {
      //TODO: put default in add_mark.html, highlight it, add enter button, get string
      //to put into pmarkByLink 
      pmarkByLink();
    }, false);
  }
}

var microsecondsPerHour = 1000 * 60 * 60;
var oneHourAgo = (new Date).getTime() - microsecondsPerHour;

document.addEventListener('DOMContentLoaded', function () {
 buildMenu('menu');
});
