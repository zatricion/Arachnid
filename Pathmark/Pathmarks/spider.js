chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {message_type: "clear_screen"});
});

// Get active tab url and save pathmark to sync storage
var addMark = function (option) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var title = tabs[0].title;
    var url = tabs[0].url;
    var stripped = url.substr(url.indexOf(':') + 1);
    var info = {
      title: title,
      url: stripped,
      opt: option
    }
    // Changes popup html and sends title and url
    window.location.replace("add_mark.html#" + JSON.stringify(info));
  });
}

var startVisualization = function () {
  window.location.replace("choose_mark.html");
}

var buildMenu =  function (divName) {
  var menu = document.getElementById(divName);
  var anchors = menu.getElementsByTagName('a');
  
  // Links (right now the choices are all the same)
  anchors[0].addEventListener('click', function () {
    addMark("links");
  }, false);

  // Recent Tabs
  anchors[1].addEventListener('click', function () {
    addMark("recents");
  }, false);

  // Both
  anchors[2].addEventListener('click', function () {
    addMark("both");
  }, false);


  // Visualize Pathmarks
  anchors[3].addEventListener('click', function () {
    startVisualization(); 
  }, false);

  // Clear Pathmarks
  anchors[4].addEventListener('click', function () {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {message_type:"clear"});
    });
  }, true);
}

document.addEventListener('DOMContentLoaded', function () {
 buildMenu('menu');
});
