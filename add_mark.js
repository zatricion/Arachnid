// Parse the object sent as json after the hash
var obj = JSON.parse(window.location.hash.substr(1));

var title = obj.title;
var url = obj.url;

var main = function () {
  document.getElementById('title').value = title;

  // Compatibility
  var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ?
    'runtime' : 'extension';

  document.getElementById('submit').addEventListener("click", function () {
    console.log("ajdlfkjsa");
    var titleVal = document.getElementById('title').value;
    chrome[runtimeOrExtension].sendMessage({message_type:"pathmark", name:titleVal, url:url},
      function() {});
  }, false);
}

document.addEventListener('DOMContentLoaded', function () {
  main();
});
