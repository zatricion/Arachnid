function saveGraph() {
	chrome.local.set({
		'node':details
	}, function(){
		console.log(details.url);
	});
}

chrome.webNavigation.onCommitted.addListener(function(details) { saveGraph() });

