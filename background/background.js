chrome.runtime.onInstalled.addListener(function(details){
    chrome.storage.local.get('startpage_settings', function(e){
		if(e.startpage_settings == undefined){
			chrome.storage.local.set({startpage_settings:{
				darkmode: false,
				darkmode_auto: false,
				darkmode_auto_time: {from: "19:00", to:"08:00"},
				blob: true,
				sidebar: true,
				sidebar_websites:[],
				search_engines: [
					{name: "Google", url: "https://www.google.de/search?q=", color: "#acc0e6"}
				],
				darksky_key: "",
				darksky_loc: {lat: -1, lon: -1},
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
});

// MAIN

var redir = ['opera://startpage/', 'browser://startpage/', 'chrome://startpage/'];

var startpage_path = "/startpage/startpage.html"

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
	} else if(request.navigate != undefined){
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

	if(request.action = "udpate_dark"){
		chrome.storage.local.get("startpage_settings", function(a){
			chrome.storage.local.get("startpage_profiles", function(pr){
	
				let profiles = pr.startpage_profiles;
				profiles.forEach(profile => {
					settings = profile.settings;
					dm = settings.darkmode;
					auto = settings.darkmode_auto;
		
					from = settings.darkmode_auto_time.from;
					to = settings.darkmode_auto_time.to;
		
					if(auto){
						var time = {
							m: new Date().getMinutes(),
							h: new Date().getHours()
						}
	
						settings.darkmode = Date.parse('01/01/2011 ' + from) < Date.parse('01/01/2011 ' + to) ? (Date.parse('01/01/2011 ' + time.h + ":" + time.m) >= Date.parse('01/01/2011 ' + from) && Date.parse('01/01/2011 ' + time.h + ":" + time.m) <= Date.parse('01/01/2011 ' + to)) : (Date.parse('01/01/2011 ' + time.h + ":" + time.m) <= Date.parse('01/01/2011 ' + to) || Date.parse('01/01/2011 ' + time.h + ":" + time.m) >= Date.parse('01/01/2011 ' + from));
						
					}
					profile.settings = settings;
				});
				chrome.storage.local.set({startpage_profiles: profiles})
	
				settings = a.startpage_settings;
				dm = settings.darkmode;
				auto = settings.darkmode_auto;
	
				from = settings.darkmode_auto_time.from;
				to = settings.darkmode_auto_time.to;
	
				if(auto){
					var time = {
						m: new Date().getMinutes(),
						h: new Date().getHours()
					}
	
					settings.darkmode = Date.parse('01/01/2011 ' + from) < Date.parse('01/01/2011 ' + to) ? (Date.parse('01/01/2011 ' + time.h + ":" + time.m) >= Date.parse('01/01/2011 ' + from) && Date.parse('01/01/2011 ' + time.h + ":" + time.m) <= Date.parse('01/01/2011 ' + to)) : (Date.parse('01/01/2011 ' + time.h + ":" + time.m) <= Date.parse('01/01/2011 ' + to) || Date.parse('01/01/2011 ' + time.h + ":" + time.m) >= Date.parse('01/01/2011 ' + from));
					chrome.storage.local.set({startpage_settings: settings})
				}
				
				sendResponse({updated: true})
			})
		})
	}

	return true;
});