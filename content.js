;

URL = document.URL;
URL = URL.substr(strig.indexOf(':') + 1);

var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ?
                         'runtime' : 'extension';

chrome[runtimeOrExtension].sendMessage({referrer:document.referrer, url:URL}, function() {});


