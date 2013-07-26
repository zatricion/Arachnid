var main = function () {
  var intRegex = /^\d+$/;
  var menu = document.getElementById('menu');

  chrome.storage.sync.get(null, function (pathmarks) {
    for (name in pathmarks) {
      if (name !== "favicons" && name != "index" && !intRegex.test(name)) {
        var a = document.createElement('a');
        var linkText = document.createTextNode(name);
        a.appendChild(linkText);
        a.href = "#";
        a.className = "choice";
        a.addEventListener('click', function (event) {
          showPathmark(this.text);
        });
        menu.appendChild(a);
        var d = document.createElement('li');
        d.className = "divider";
        menu.appendChild(d);
      }
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
