;

function addNode(url, referrer) {
  nodes = chrome.storage.local;
  edge = {
    in_node: referrer,
    timestamp: Date()
  };

  nodes.get(url, function(current_node){
    console.log(current_node);
    if ( $.isEmptyObject(current_node) === false ) {
      current_node[url].push(edge);
      nodes.remove(url);
      nodes.set({url:current_node}, function(response){
        if ( chrome.runtime.lastError ) {
          console.log(chrome.runtime.lastError);
        }
        else {
          console.log("Updated Node with url " + url + " and created new edge from " + edge.in_node + " at time " + edge.timestamp);
        }
      });
    }
    else {
      console.log("set: "+url);
      nodes.set({url:[edge]}, function(){
        if ( chrome.runtime.lastError ) {
          console.log(chrome.runtime.lastError);
        }
        else {
          console.log("get: "+url);
          chrome.storage.local.get(url, function(thing) {console.log(thing)});
          console.log("Created new Node for url " + url + " and new edge from " + edge.in_node + " at time " + edge.timestamp);
        }
      });
    }
  });
}

var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ?
                         'runtime' : 'extension';

chrome[runtimeOrExtension].onMessage.addListener(
  function(request, sender, sendResponse) {
    addNode(request.url, request.referrer);
 });
