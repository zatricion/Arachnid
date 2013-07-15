function saveGraph() {
  chrome.local.set({
    'node':details
  }, function(){
    console.log(details.url);
  });
}


function addNode(url, referrer) {
  nodes = chrome.storage.local;
  edge = {
    in_node: referrer,
    timestamp: Date()
  };

  current_node = nodes.get(url, function(){console.log("got shit")});
  if ( current_node ) {
    current_node.append(edge);
    nodes.remove(url);
    nodes.set({url:current_node}, console.log("Updated Node with url " + url + " and created new edge from " + edge.in_node + " at time " + edge.timestamp));
  } else {
    nodes.set({url:[edge]}, console.log("Created new Node for url " + url + " and new edge from " + edge.in_node + " at time " + edge.timestamp));
  }

}

var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ?
                         'runtime' : 'extension';

chrome[runtimeOrExtension].onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("url: "+ request.url + " and referrer: " + request.referrer);
    addNode(request.url, request.referrer);
 });
