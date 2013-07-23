;

var URL = document.URL;
var URL = URL.substr(URL.indexOf(':') + 1);

var REF = document.referrer;
var REF = REF.substr(REF.indexOf(':') + 1);

var getFaviconAndSend = function (url, ref) {
  var favicon;
  $.get(ref, function (data) {
    var favRe = /(?:rel="shortcut icon"|rel="icon").*href="(.*\.(ico|png|gif|jpg|jpeg)?)"/;
    var stripRe = /([\w]+\.){1}([\w]+\.?)+/;
    favicon = favRe.exec(data);
    if (favicon && favicon[1] !== 'favicon.ico') {
      var httpCheck = /http:/;
      if (httpCheck.test(favicon[1])) {
        favicon = favicon[1];
      }
      else {
        favicon = 'http:' + favicon[1];
      }
    }
    else {
      favicon = 'http://' + stripRe.exec(ref)[0] + '/favicon.ico';
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

getFaviconAndSend(URL, REF);


//
// Visualization
//

var getPathmark = function (name, links) {
  chrome.storage.sync.get(null, function (pathmarks) {
    for (elem in pathmarks[name]) { 
      pathmarks[name][elem].forEach(function(thing, index) {
        if (thing.in_node) {
          var thing2 = {
            source: thing.in_node,
            target: elem,
            time: thing.timestamp, 
            favicon: thing.favicon}; 

          links.push(thing2);
        }
      }); 
    }
    // This calls D3 script
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
  overlay.addEventListener('click', function () {clearScreen();}, false);

  // Resize canvas when window is resized
  window.addEventListener( 'resize', onWindowResize, false );

  getPathmark(pathmark, []);
}

var clearScreen = function () {
  d3.select('svg').remove();
  d3.select('canvas').remove();
}

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
    });

