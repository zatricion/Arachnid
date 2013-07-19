
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

var buildMenu =  function (divName) {
  var menu = document.getElementById(divName);
  var anchors = menu.getElementsByTagName('a');
  for (var i = 0; i < anchors.length; ++i) {
    anchors[i].addEventListener('click', function () {
      pmarkByLink();
    }, false);
  }
}

var microsecondsPerHour = 1000 * 60 * 60;
var oneHourAgo = (new Date).getTime() - microsecondsPerHour;

document.addEventListener('DOMContentLoaded', function () {
 buildMenu('menu');
});
