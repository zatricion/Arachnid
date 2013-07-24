;

var nodes = chrome.storage.local;
var pmarks = chrome.storage.sync;

// Clear chrome local storage each session
nodes.clear();
console.log("Cleared local storage");

var createNode = function (url, referrer) {
  var edge = {
    in_node: referrer,
    timestamp: Date()
  };

  nodes.get(url, function(currentNode){
    currentNode[url] = currentNode[url] || [];
    currentNode[url].push(edge);
    nodes.set(currentNode, function(response){
      if ( chrome.runtime.lastError ) {
        console.log(chrome.runtime.lastError);
      }
      else {
        if (currentNode[url].length > 1) {
          console.log("Updated Node with url " + url + " and created new edge from " + 
            edge.in_node + " at time " + edge.timestamp);
        }
        else {
          console.log("Created new Node for url " + url + " and new edge from " + 
            edge.in_node + " at time " + edge.timestamp);
        }
      }
    });
  });
}

var handleReferrers = function(referrers, output, callback) {
  if (referrers.length > 0) {
    savePath(referrers[0].in_node, output, function(newOutput) {
      handleReferrers(referrers.slice(1), newOutput, callback);
    });
  } else {
    callback(output);
  }
};

var savePath = function(url, output, callback) {
  nodes.get(url, function(refObj) {
    // First predicate stops infinite loops and re-adding objects
    if (output[url] === undefined && refObj[url] !== undefined) {
      var referrers = refObj[url];
      output[url] = referrers;
      handleReferrers(referrers, output, function(finalOutput) {
        callback(finalOutput);
      });
    } else {
      callback(output);
    }
  });
};

var saveAll = function (title) {
  nodes.get(null, function (refObj) {
    var pathmark = {};
    pathmark[title] = refObj;
    pmarks.set(pathmark);
  });
}

saveRecents = function (title, minutes) {
  chrome.storage.local.get(null, function (refObj) {
    var output = {};
    cutoffTime = Date.now() - (1000 * 60 * minutes);
    for (item in refObj) {
      refObj[item].forEach(function (edge) {
        time = new Date(edge.timestamp).getTime();
        if (time > cutoffTime) {
          output[item] = output[item] || [];
          output[item].push(edge);
        }});
    }
    var pathmark = {};
    pathmark[title] = output;
    pmarks.set(pathmark);
  });
}

var createPathmark = function (stripped, title, option) {
  if (option === "links") {
    savePath(stripped, {}, function (output) {
      var pathmark = {};
      pathmark[title] = output;
      pmarks.set(pathmark);
    });
  } else if (option === "recents") {
    // Ten Minutes Ago is "recent", but allow specify in options page
    saveRecents(title, 10);
  } else if (option === "both") {
    saveAll(title);
  }
}

//           //
// LISTENERS //
//           //

var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ?
                         'runtime' : 'extension';

chrome[runtimeOrExtension].onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message_type === "node") {
      createNode(request.url, request.referrer);
    }
    else if (request.message_type === "pathmark") {
      createPathmark(request.url, request.name, request.opt);
    }
    else if (request.message_type === "newtab") {
      chrome.tabs.create( {url: request.url,
                          active: false});
    }
 });
