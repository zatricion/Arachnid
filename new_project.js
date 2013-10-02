var createUUID = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

var buttonListener =  function () {
  var titleVal = document.getElementById('title').value;
  chrome.storage.sync.get('my_projects', function (obj) {
    var projects = obj.my_projects || {};
    projects.my_current_project = titleVal;
    projects[titleVal] = createUUID();
    chrome.storage.sync.set({'my_projects': projects});
  });
  window.close();
}

var enterKeyListener = function (e) {
  if (e.keyCode == 13) {
   buttonListener();
  }
}

var main = function () {
  // Set up default value (title highlight it for easy renaming
  var markName = document.getElementById('title')
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
