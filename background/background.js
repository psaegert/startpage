// DEFAULTS

chrome.storage.local.get('startpage_darkmode', function(e){
	if(e.startpage_darkmode == undefined){
		chrome.storage.local.set({startpage_darkmode:false});
	}
});

chrome.storage.local.get('startpage_autocomplete', function(e){
	if(e.startpage_autocomplete == undefined){
		chrome.storage.local.set({startpage_autocomplete:true});
	}
});

chrome.storage.local.get('startpage_autocomplete_queries', function(e){
	if(e.startpage_autocomplete_queries == undefined){
		chrome.storage.local.set({startpage_autocomplete_queries:[]});
	}
});

chrome.storage.local.get('startpage_blob', function(e){
	if(e.startpage_blob == undefined){
		chrome.storage.local.set({startpage_blob:true});
	}
});

chrome.storage.local.get('startpage_sidebar', function(e){
	if(e.startpage_sidebar == undefined){
		chrome.storage.local.set({startpage_sidebar:true});
	}
});

chrome.tabs.create({ url: "/settings/settings.htm" });

// MAIN

var redir = ['opera://startpage/', 'browser://startpage/', 'chrome://startpage/'];

var startpage_path = "/startpage/index.html"

chrome.tabs.onCreated.addListener(function(tab){
	
	for (var i = 0; i < redir.length; i++) {
		if(tab.url === redir[i])
			break;
		if(i == redir.length - 1)
			return;
	};

	chrome.tabs.create({
		url:"/startpage/index.html"
	});
	chrome.tabs.remove(tab.id);
	
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.navigate == "home"){
			if(request.newTab == "true"){
				chrome.tabs.create({
					url:"/startpage/index.html"
				});

			} else if(request.newTab == "false") {
				chrome.tabs.getSelected(function (tab) {
					chrome.tabs.update(tab.id, {url:"/startpage/index.html"});
				});
			}
		} else {
			if(request.newTab == "true"){
				if((typeof request.navigate) != undefined){
					chrome.tabs.create({
						url:request.navigate
					});
				} else {
					chrome.tabs.create({
						url:"settings.htm"
					});
				}
			} else if(request.newTab == "false") {
				chrome.tabs.getSelected(function (tab) {
					if((typeof request.navigate) != undefined){
						chrome.tabs.update(tab.id, {url: request.navigate});
					} else {
						chrome.tabs.create({
							url:"settings.htm"
						});
					}
				});
			}
		}
		return true;
	}
);
