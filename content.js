;

var URL = document.URL;
var URL = URL.substr(URL.indexOf(':') + 1);

var REF = document.referrer;
var REF = REF.substr(REF.indexOf(':') + 1);

// Compatibility
var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ?
                         'runtime' : 'extension';

chrome[runtimeOrExtension].sendMessage({message_type:"node", referrer:REF, url:URL},
    function() {});



// Visualization

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
  overlay.style.zIndex = 2147483647;
  overlay.style.pointerEvents = 'none';
  onWindowResize();
  overlayContext.clearRect( 0, 0, overlay.width, overlay.height );
  overlayContext.fillStyle = 'rgba( 0, 0, 0, 0.7 )';
  overlayContext.fillRect( 0, 0, overlay.width, overlay.height );
}

chrome[runtimeOrExtension].onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message_type === "visual") {
        visualize();
      }
    });


