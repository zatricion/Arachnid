// Parse the object sent as json after the hash
var obj = JSON.parse(window.location.hash.substr(1));

var title = obj.title;
var url = obj.url;
var opt = obj.opt;

// Compatibility
var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ?
  'runtime' : 'extension';

var buttonListener =  function () {
  var titleVal = document.getElementById('title').value;
  chrome[runtimeOrExtension].sendMessage({
    message_type: "pathmark", 
    name: titleVal, 
    url: url,
    opt: opt });
  window.close();
}

var enterKeyListener = function (e) {
  if (e.keyCode == 13) {
   buttonListener();
  }
}

var main = function () {
  // Set up default value (title of page) and highlight it for easy renaming
  var markName = document.getElementById('title')
  markName.value = title;
  markName.select();

  // Submit on Enter key
  markName.addEventListener("keydown", enterKeyListener, false);
  
  // Submit on button click
  var submit = document.getElementById('submit');
  submit.addEventListener("click", buttonListener, false);
}

document.addEventListener('DOMContentLoaded', function () {
  main();
});
