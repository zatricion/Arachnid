;

var URL = document.URL;
var URL = URL.substr(URL.indexOf(':') + 1);

var REF = document.referrer;
var REF = REF.substr(REF.indexOf(':') + 1);

// Compatibility
var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';

// Keeps track of visit history
document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    chrome[runtimeOrExtension].sendMessage({message_type:"node", referrer:REF, url:URL});
  }
}


//
// Visualization
//

var getPathmark = function (name, links) {
  chrome.storage.sync.get(null, function (pathmarks) {
    for (elem in pathmarks[name]) { 
      pathmarks[name][elem].forEach(function(thing, index) {
        var thing2 = {source: thing.in_node,
                      target: elem,
                      time: thing.timestamp, 
                      favicon: thing.favicon}; 
        links.push(thing2);
      }); 
    }
    plotPathmark(links);
  });
}

var onWindowResize = function (event) {
  overlay.width = window.innerWidth;
  overlay.height = window.innerHeight;
}

var visualize = function () {
  overlay = document.createElement( 'canvas' );
  document.body.appendChild(overlay);
  overlayContext = overlay.getContext( '2d' );
  overlay.style.position = 'fixed';
  overlay.style.left = 0;
  overlay.style.top = 0;
  overlay.style.zIndex = 0;
  overlay.style.pointerEvents = 'none';
  onWindowResize();
  overlayContext.clearRect( 0, 0, overlay.width, overlay.height );
  overlayContext.fillStyle = 'rgba( 0, 0, 0, 0.7 )';
  overlayContext.fillRect( 0, 0, overlay.width, overlay.height );

  links = [];
  getPathmark("Test", links);
}

chrome[runtimeOrExtension].onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message_type === "visual") {
        visualize();
      }
    });


