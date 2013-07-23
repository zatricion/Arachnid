var obj = JSON.parse(window.location.hash.substr(1));
var tabID = obj.id;
console.log(tabID);


var menu = document.getElementById('menu');

chrome.storage.sync.query(null, function (pathmarks) {
  for (name in pathmarks) {
    var a = document.createElement('a');
    var linkText = document.createTextNode(name);
    a.appendChild(linkText);
    a.href = "#";
    menu.appendChild(a);
  }
}
  
//chrome.tabs.sendMessage(tabs[0].id, {message_type:"visual", name: pathmark});
//window.close();
