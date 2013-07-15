;

var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ?
                         'runtime' : 'extension';

chrome[runtimeOrExtension].sendMessage({referrer:document.referrer, url:document.URL}, function() {});


