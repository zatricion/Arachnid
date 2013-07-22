
// Get active tab url and save pathmark to sync storage
var pmarkByLink = function () {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var title = tabs[0].title;
    var url = tabs[0].url;
    var stripped = url.substr(url.indexOf(':') + 1);
    var info = {
      title: title,
      url: stripped
    }
    // Changes popup html and sends title and url
    window.location.replace("add_mark.html#" + JSON.stringify(info));
  });
}

var startVisualization = function () {

  chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message_type:"visual"});
  });
  window.close();
}

var buildMenu =  function (divName) {
  var menu = document.getElementById(divName);
  var anchors = menu.getElementsByTagName('a');
  
  // Links (right now the choices are all the same)
  anchors[0].addEventListener('click', function () {
    pmarkByLink();
  }, false);

  // Time Slice
  anchors[1].addEventListener('click', function () {
    pmarkByLink();
  }, false);

  // Both
  anchors[2].addEventListener('click', function () {
    pmarkByLink();
  }, false);


  // Visualize Pathmarks
  anchors[3].addEventListener('click', function () {
    startVisualization();
  }, false);


}

document.addEventListener('DOMContentLoaded', function () {
 buildMenu('menu');
});
