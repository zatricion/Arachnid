function loadOptions() {
  var recents = document.getElementById("time");
  var save = document.getElementById("save");
  var restore = document.getElementById("restore");
  var sender = document.getElementById("yes");

  save.onclick = saveOptions;
  restore.onclick = restoreDefaults;

  var longAgo = localStorage["longAgo"];

  if (longAgo == undefined) {
    restoreDefaultLongAgo();
  } else {
    recents.value = longAgo;
  }
  
  var send = localStorage["sendToSpider"];

  if (send == undefined) {
    restoreDefaultSend();
  } else {
    sender.checked = JSON.parse(send);

  }

}

function saveOptions () {
  var recents = document.getElementById("time");
  var sender = document.getElementById("yes");
  localStorage["longAgo"] = recents.value;
  localStorage["sendToSpider"] = sender.checked;
  
  chrome.extension.getBackgroundPage().refreshOptions();
}

function restoreDefaultLongAgo () {
  var recents = document.getElementById("time");
  recents.value = "10";
  localStorage["longAgo"] = "10";
}

function restoreDefaultSend () {
  var sender = document.getElementById("yes");
  sender.checked = true;
  localStorage["sendToSpider"] = true;
}

function restoreDefaults () {
  restoreDefaultSend();
  restoreDefaultLongAgo();
}

document.addEventListener("DOMContentLoaded", loadOptions, false);
