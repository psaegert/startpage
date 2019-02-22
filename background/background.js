// DEFAULTS

chrome.storage.local.get('startpage_settings', function(e){
	if(e.startpage_settings == undefined){
		chrome.storage.local.set({startpage_settings:{
			darkmode: false,
			darkmode_auto: false,
			blob: true,
			sidebar: true,
			sidebar_websites:[],
			weather: true,
		}});
	}

	chrome.storage.local.get('startpage_profiles', function(a){
		chrome.storage.local.get('startpage_settings', function(s){
			if(a.startpage_profiles == undefined){
				chrome.storage.local.set({startpage_profiles:[{name: "Default", settings:s.startpage_settings}]});
			}

			chrome.storage.local.get('startpage_selected_profile', function(sp){
				if(sp.startpage_selected_profile == undefined){
					chrome.storage.local.get('startpage_profiles', function(pr){
						if(pr.startpage_profiles.filter(profile => profile.name == "Default").length != 0){
							chrome.storage.local.set({startpage_selected_profile:"Default"});
						} else {
							chrome.storage.local.set({startpage_selected_profile:""});
						}
					});
				}
			});
		});
	});
});

chrome.storage.local.get('startpage_autocomplete', function(e){
	let startpage_autocomplete = e.startpage_autocomplete;
	if(startpage_autocomplete == undefined){
		chrome.storage.local.set({startpage_autocomplete:{
			enabled: true,
			suggestions: [],
			last: ""
		}});
	}
});


// MAIN

var redir = ['opera://startpage/', 'browser://startpage/', 'chrome://startpage/'];

var startpage_path = "/startpage/startpage.html"

chrome.tabs.onUpdated.addListener(function(tab){
	
});

chrome.tabs.onCreated.addListener(function(tab){
	
	for (var i = 0; i < redir.length; i++) {
		if(tab.url === redir[i])
			break;
		if(i == redir.length - 1)
			return;
	};

	chrome.tabs.create({
		url:"/startpage/startpage.html"
	});
	chrome.tabs.remove(tab.id);
	
});

// BLOB

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.navigate == "home"){
			if(request.newTab == "true"){
				chrome.tabs.create({
					url:"/startpage/startpage.html"
				});

			} else if(request.newTab == "false") {
				chrome.tabs.getSelected(function (tab) {
					chrome.tabs.update(tab.id, {url:"/startpage/startpage.html"});
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
						url:"settings.html"
					});
				}
			} else if(request.newTab == "false") {
				chrome.tabs.getSelected(function (tab) {
					if((typeof request.navigate) != undefined){
						chrome.tabs.update(tab.id, {url: request.navigate});
					} else {
						chrome.tabs.create({
							url:"settings.html"
						});
					}
				});
			}
		}
		return true;
	}
);
