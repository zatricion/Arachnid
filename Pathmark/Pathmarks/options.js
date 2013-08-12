function loadOptions() {
  var select = document.getElementById("time");
  var save = document.getElementById("save");
  var restore = document.getElementById("restore");
  
  save.onclick = saveOptions;
  restore.onclick = restoreDefault;

  var longAgo = localStorage["longAgo"];

  if (longAgo == undefined) {
    restoreDefault();
  } else {
    select.value = longAgo;
  }
}

function saveOptions() {
  var select = document.getElementById("time");
  localStorage["longAgo"] = select.value;
  chrome.extension.getBackgroundPage().refreshOptions();
}

function restoreDefault() {
  var select = document.getElementById("time");
  select.value = "10";
  localStorage["longAgo"] = "10";
}

document.addEventListener("DOMContentLoaded", loadOptions, false);
