// Compatibility
var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';

var URL = document.URL;
var URL = URL.substr(URL.indexOf(':') + 1);

var send = function (referrer, url) {
  chrome[runtimeOrExtension].sendMessage({
    message_type: "node",
    referrer: referrer,
    url: url 
  });
}

// Add node to graph
chrome.storage.local.get("REF", function (data) {
  send(data.REF, URL);
  chrome.storage.local.set({REF: ""});
});

//
// Visualization
//

var getFavicon = function (url, callback) {
  var favicon;
  // Parse url
  var a = document.createElement('a');
  a.href = url;
  var domain = 'http://' + a.hostname;
  var favCheck = /(?:https?:)?(?:\/*)(.*?)(?:\/*)favicon.(ico|png|jpg|jpeg)/;
  var oneSlash = /^(\/)(?!\/)/;
  var dfd = $.Deferred();

  // Try to get favicon from cache, otherwise find it, then cache it
  chrome.storage.sync.get("favicons", function (favCache) {
    favCache.favicons = favCache.favicons || {};
    if (favCache.favicons[url]) {
      favicon = favCache.favicons[url];
      callback(url, favicon);
      dfd.resolve();
    } else {
      $.get(url)
          .success(
            function (data) {
              favicon =  $("<div>").html(data).find('link[rel*="icon"]').attr("href");
              if (favicon) {
                // See if the favicon needs the domain prepended
                if (favCheck.test(favicon) && !/^(https?:)?\/{2}/.test(favicon)) {
                  if (oneSlash.test(favicon)) {
                    favicon = domain + favicon;
                  } else {
                    favicon = domain + '/' + favicon;
                  }
                }
              } else {
                  favicon = domain + '/favicon.ico';
              } 

              // Cache favicon
              favCache.favicons[url] = favicon;
              chrome.storage.sync.set(favCache);
              
              callback(url, favicon);
              dfd.resolve();
              })
        .error(
            function () {
              favicon = domain + '/favicon.ico';

              // Cache favicon
              favCache.favicons[url] = favicon;
              chrome.storage.sync.set(favCache);

              callback(url, favicon);
              dfd.resolve();
            });
    }
  });
  
  return dfd.promise();
}

var getPathmark = function (name, links) {
  chrome.storage.sync.get(null, function (pathmarks) {
    pathmarks[name].forEach(function (markInd) {
      for (mark in pathmarks[markInd]) {
        pathmarks[markInd][mark].forEach(function (pathmark) {
          if (pathmark.in_node) {
            var link = {
              source: pathmark.in_node,
              target: mark,
              time: pathmark.timestamp
            }; 

            links.push(link);
          }
        });
      }
    });

  getNodes(links);
  });
}

var onWindowResize = function (event) {
  overlayContext.clearRect( 0, 0, overlay.width, overlay.height );
  width = window.innerWidth;
  height = window.innerHeight;
  overlay.width = width;
  overlay.height = height;
  overlayContext.fillStyle = 'rgba( 0, 0, 0, 0.7 )';
  overlayContext.fillRect( 0, 0, overlay.width, overlay.height );
}

var clearScreen = function () {
  d3.select('svg').remove();
  d3.select('canvas').remove();
}

var switchVis = function () {
  var e = document.createEvent('UIEvents');
  var svg = document.getElementsByTagName("svg")[0];
  e.initUIEvent('dblclick', true, true, window, 1);
  svg.dispatchEvent(e);
}

var visualize = function (pathmark) {
  overlay = document.createElement( 'canvas' );
  document.body.appendChild(overlay);
  overlayContext = overlay.getContext( '2d' );
  overlay.style.position = 'fixed';
  overlay.style.left = 0;
  overlay.style.top = 0;
  overlay.style.zIndex = 111111111;
  onWindowResize();
  
  // Remove Visualization on background click
  overlay.addEventListener('click', clearScreen, false);

  // Resize canvas when window is resized
  window.addEventListener('resize', onWindowResize, false);

  getPathmark(pathmark, []);
}

// Compute the distinct nodes from the links.
var getNodes = function (links) {
  var width = window.innerWidth;
  var height = window.innerHeight;
  if (links.length > 1) {
    var times = getTimestampList(links);
  } else {
    var times = [0.5];
  }
  links.forEach(function(link, index) { link.time = times[index]; });

  // Sort the links by time
  links.sort(function(a,b) {return (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0);} );
  
  var nodes = {};
  links.forEach(function(link) {
    link.target = nodes[link.target] ||
      (nodes[link.target] = {
         name: link.target,
           xt: width * (link.time * 0.7 + 0.2),
            y: height / 2,
      });
  });

  links.forEach(function(link) {
    link.source = nodes[link.source] ||
      (nodes[link.source] = {
         name: link.source,
           xt: width * (link.time * 0.7 + 0.1),
            y: height / 2,
      });
  });

  urlArr = Object.keys(nodes);
  console.log(urlArr);
  var deferred = [];
  for (var i = 0; i < urlArr.length; i++) {
    // Get all favicons before drawing visualization
    deferred.push(
        getFavicon(urlArr[i], function (url, favicon) {
          nodes[url].favicon = favicon;}));
  }
  $.when.apply($, deferred).then(function () {
    // Call D3 script
    console.log(nodes);
    plotPathmark(links, nodes, width, height);
  });
}

// Get a normalized list of timestamps from a list of links
var getTimestampList = function (links) {
  var timestampList = [];
  links.forEach(function (link) {
    timestampList.push(link.time);
  });
  console.log(timestampList);
  var min = Math.min.apply(this, timestampList);
  console.log(min);
  var max = Math.max.apply(this, timestampList);
  console.log(max);
  for (var i = 0; i < timestampList.length; i++) {
    timestampList[i] = (timestampList[i] - min) / (max - min);
  }
  console.log(timestampList);
  return timestampList;
}

// Esc key clears the screen, tab switches visualization
document.addEventListener("keydown", function(e) {
  if (e.keyCode === 27) {
    clearScreen();
  } else if (e.keyCode === 9) {
    e.preventDefault();
    switchVis();
  }
});

chrome[runtimeOrExtension].onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message_type === "visual") {
        visualize(request.name);
      }
      else if (request.message_type === "clear") {
        if (window.confirm("Are you sure you would like to clear all Pathmarks?")) {
          chrome.storage.sync.clear();
        }
      }
      else if (request.message_type === "clear_screen") {
        clearScreen();
      }
      else if (request.message_type === "bookmark_alert") {
        var key = "Ctrl-";
        if (/mac/i.test(navigator.platform)) {
          key = "Cmd-";
        }
        alert("You haven't created a path yet. Try browsing some more. \n\nYou can bookmark this page by hitting " + key + "D");
      }
      else if (request.message_type === "save_ref") {
        chrome.storage.local.set({REF: URL});
      }
    });

