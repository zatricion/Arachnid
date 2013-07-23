var main = function () {

  var menu = document.getElementById('menu');

  chrome.storage.sync.get(null, function (pathmarks) {
    for (name in pathmarks) {
      var a = document.createElement('a');
      var linkText = document.createTextNode(name);
      a.appendChild(linkText);
      a.href = "#";
      a.className = "choice";
      a.addEventListener('click', function (event) {
        showPathmark(this.text);
      });
      menu.appendChild(a);
    }
  });
}

var showPathmark = function (pathmark) {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message_type:"visual", name: pathmark});
  });
  window.close();
}

document.addEventListener('DOMContentLoaded', main);
