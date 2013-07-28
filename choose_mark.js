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
        a.onclick = function (event) {
          showPathmark(this.text);
        };
        menu.appendChild(a);
        var d = document.createElement('li');
        d.className = "divider";
        menu.appendChild(d);
      }
    }
  });

  var edit = document.getElementById('editMarks');
  edit.onclick = editPathmarks;
}

var showPathmark = function (pathmark) {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message_type: "visual", name: pathmark});
  });
  window.close();
}

var removePathmark = function (name) {
  var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ?
    'runtime' : 'extension';
  chrome[runtimeOrExtension].sendMessage({message_type: "remove", mark: name});
}

var editPathmarks = function (event) {
  event.target.textContent = "Click on a pathmark to remove it";
  var pathmarks = document.querySelectorAll('a.choice');
  for (mark in pathmarks) {
    if (pathmarks.hasOwnProperty(mark)) {
      pathmarks[mark].onclick = function (event) {
        event.target.parentNode.removeChild(event.target.nextSibling);
        event.target.parentNode.removeChild(event.target);
        removePathmark(this.text);
      };
      pathmarks[mark].className = "edit";
    }
  }
}

document.addEventListener('DOMContentLoaded', main);
