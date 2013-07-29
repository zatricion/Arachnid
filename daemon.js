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

saveRecents = function (minutes, callback) {
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
    callback(output);
  });
}

// Gets the current index from sync storage
var getInd = function () {
  dfd = $.Deferred();
  chrome.storage.sync.get("index", function (indObj) {
    var index = indObj["index"] || 0;
    dfd.resolve(index);
  });
  return dfd.promise();
}

// Sets the current index
var setInd = function (num) {
  chrome.storage.sync.set({"index": num});
}

// Given an object for a pathmark, sets the mark in sync storage
var setMark = function (refObj, index, title) {
  var indLst = [];
  for (item in refObj) {
    indLst.push(index);
    var mark = {};
    var edge = {};
    edge[item] = refObj[item];
    mark[index] = edge;
    pmarks.set(mark);
    index++;
  }
  var pathmark = {}

  // Attach correct list of indices to pathmark
  pathmark[title] = indLst;
  pmarks.set(pathmark);
  setInd(index);
}

var createPathmark = function (index, stripped, title, option) {
  if (option === "links") {
    savePath(stripped, {}, function (output) { 
      if (checkPathmark(output)) {
        setMark(output, index, title); 
      }
    });
  } else if (option === "recents") {
    // Ten Minutes Ago is "recent", but allow specify in options page
    saveRecents(10, function (output) { 
      if (checkPathmark(output)) {
        setMark(output, index, title); 
      }
    });
  } else if (option === "both") {
    nodes.get(null, function (output) { 
      if (checkPathmark(output)) {
        setMark(output, index, title);
      }
    });
  }
}

var checkPathmark = function (pathmark) {
  for (edge in pathmark) {
    pathmark[edge].forEach(function (data) {
      if (data.in_node) {
        return true;
      }
    });
  }
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message_type: "bookmark_alert"});
  });
  return false;
}

var removePathmark = function (name) {
  pmarks.get(name, function (pmark) {
    pmark[name].forEach(function (item) {
      pmarks.remove(item.toString());
    });
    pmarks.remove(name);
  });
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
      getInd().done(function (index) {
        createPathmark(index, request.url, request.name, request.opt);
      });
    }
    else if (request.message_type === "newtab") {
      chrome.tabs.create( {url: request.url,
                          active: false});
    }
    else if (request.message_type === "remove") {
      removePathmark(request.mark);
    }
 });
