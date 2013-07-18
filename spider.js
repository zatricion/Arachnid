
var nodes = chrome.storage.local;
var pmarks = chrome.storage.sync;

// TODO: Implement user interface and let user save pathmark as something -
// that thing is then the key to a storage.sync object which contains the pathmark

var handleReferrers = function(referrers, output, callback) {
  if (referrers.length > 0) {
    savePath(referrers[0].in_node, output, function(newOutput) {
      handleReferrers(referrers.slice(1), newOutput, callback);
    });
  } else {
    callback(output);
  }
};

var savePath = function(url, output, callback) {
  nodes.get(url, function(refObj) {
    console.log(refObj);
    if (output[url] === undefined && refObj[url] !== undefined) {
      var referrers = refObj[url];
      output[url] = referrers;
      handleReferrers(referrers, output, function(finalOutput) {
        callback(finalOutput);
      });
    } else {
      callback(output);
    }
  });
};

// Get active tab url and save pathmark to sync storage
var pmarkByLink = function () {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var title = tabs[0].title;
    var url = tabs[0].url;
    var stripped = url.substr(url.indexOf(':') + 1);
    //window.location.replace("add_mark.html");
    //document.addEventListener('DOMContentLoaded', function () {
    //  alert("hi");
    //  document.getItemById("title").value(title);
    //});
    console.log(stripped);
    savePath(stripped, {}, function (output) {
      var pathmark = {};
      pathmark[title] = output;
      pmarks.set(pathmark);
    });
  });
}

var buildMenu =  function (divName) {
  var menu = document.getElementById(divName);
  var anchors = menu.getElementsByTagName('a');
  for (var i = 0; i < anchors.length; ++i) {
    anchors[i].addEventListener('click', function () {
      //TODO: put default in add_mark.html, highlight it, add enter button, get string
      //to put into pmarkByLink 
      alert("hi");
      pmarkByLink();
    }, false);
  }
}

var microsecondsPerHour = 1000 * 60 * 60;
var oneHourAgo = (new Date).getTime() - microsecondsPerHour;

document.addEventListener('DOMContentLoaded', function () {
 buildMenu('menu');
});
