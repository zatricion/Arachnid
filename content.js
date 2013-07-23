;

var URL = document.URL;
var URL = URL.substr(URL.indexOf(':') + 1);

var REF = document.referrer;
var REF = REF.substr(REF.indexOf(':') + 1);

var getFaviconAndSend = function (url, ref) {
  var favicon;
  $.get(url, function (data) {
    favRe = /(?:rel="shortcut icon"|rel="icon").*href="(.*\.(ico|png|gif|jpg|jpeg)?)"/;
    stripRe = /([\w]+\.){1}([\w]+\.?)+/;
    favicon = favRe.exec(data);
    if (favicon && favicon[1] !== 'favicon.ico') {
      favicon = favicon[1];
    }
    else {
      favicon = stripRe.exec(url)[0] + '/favicon.ico';
    }
    send(ref, url, favicon);
  });
}

var send = function (referrer, url, favicon) {
  chrome[runtimeOrExtension].sendMessage({
    message_type: "node",
    referrer: referrer,
    url: url, 
    favicon: favicon});
}

// Compatibility
var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';

// Keeps track of visit history
document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    getFaviconAndSend(URL, REF);
  }
}


//
// Visualization
//

var getPathmark = function (name, links) {
  chrome.storage.sync.get(null, function (pathmarks) {
    for (elem in pathmarks[name]) { 
      pathmarks[name][elem].forEach(function(thing, index) {
        if (thing.in_node) {
          var thing2 = {source: thing.in_node,
            target: elem,
            time: thing.timestamp, 
            favicon: thing.favicon}; 

          links.push(thing2);
        }
      }); 
    }
    plotPathmark(links);
  });
}

var onWindowResize = function (event) {
  overlayContext.clearRect( 0, 0, overlay.width, overlay.height );
  overlay.width = window.innerWidth;
  overlay.height = window.innerHeight;
  overlayContext.fillStyle = 'rgba( 0, 0, 0, 0.7 )';
  overlayContext.fillRect( 0, 0, overlay.width, overlay.height );
}

var visualize = function () {
  overlay = document.createElement( 'canvas' );
  document.body.appendChild(overlay);
  overlayContext = overlay.getContext( '2d' );
  overlay.style.position = 'fixed';
  overlay.style.left = 0;
  overlay.style.top = 0;
  overlay.style.zIndex = 111111;
  overlay.style.pointerEvents = 'none';
  onWindowResize();

  window.addEventListener( 'resize', onWindowResize, false );

  links = [];
  getPathmark("Test", links);
}

chrome[runtimeOrExtension].onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message_type === "visual") {
        visualize();
      }
    });

