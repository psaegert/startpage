chrome.runtime.onInstalled.addListener(function(details){
    chrome.storage.local.get('startpage_settings', function(e){
		if(e.startpage_settings == undefined){
			chrome.storage.local.set({startpage_settings:{
				blob: true,
				darkmode: false,
				darkmode_auto: true,
				darkmode_auto_time: {
							from: "18:10",
							to: "07:30"
				},
				darksky_key: "",
				darksky_loc: {
							lat: 0,
							lon: 0
				},
				mains: [
							{
										advanced: false,
										bar: "",
										context: [
													{
																name: "Subscriptions",
																url: "https://www.youtube.com/feed/subscriptions"
													}
										],
										cover: "rgb(255, 160, 160)",
										fill: "",
										img: "Youtube.png",
										inner: "",
										name: "Youtube",
										outer: "",
										url: "https://www.youtube.com/"
							},
							{
										advanced: false,
										bar: "",
										context: [
													{
																name: "Likes",
																url: "https://soundcloud.com/you/likes"
													},
													{
																name: "History",
																url: "https://soundcloud.com/you/history"
													},
													{
																name: "Stream",
																url: "https://soundcloud.com/stream"
													}
										],
										cover: "rgb(255, 200, 160)",
										fill: "",
										img: "Soundcloud.png",
										inner: "",
										name: "Soundcloud",
										outer: "",
										url: "https://soundcloud.com/discover/"
							},
							{
										advanced: false,
										bar: "",
										context: [
													{
																name: "22:00",
																url: "https://www.tvspielfilm.de/tv-programm/sendungen/fernsehprogramm-nachts.html"
													}
										],
										cover: "rgb(160, 160, 255)",
										fill: "",
										img: "TV.png",
										inner: "",
										name: "TV",
										outer: "",
										url: "https://www.tvspielfilm.de/tv-programm/sendungen/abends.html"
							},
							{
										advanced: false,
										bar: "",
										context: [
													{
																name: "Nightblue3",
																url: "https://www.twitch.tv/nightblue3"
													},
													{
																name: "ESL CS:GO",
																url: "https://www.twitch.tv/esl_csgo"
													}
										],
										cover: "rgb(220, 160, 255)",
										fill: "",
										img: "Twitch.png",
										inner: "",
										name: "Twitch",
										outer: "",
										url: "https://www.twitch.tv/directory"
							},
							{
										advanced: false,
										bar: "",
										context: [
													{
																name: "New",
																url: "https://www.reddit.com/submit"
													}
										],
										cover: "rgb(255, 180, 140)",
										fill: "",
										img: "Reddit.png",
										inner: "",
										name: "Reddit",
										outer: "",
										url: "https://www.reddit.com/"
							}
				],
				search_engines: [
							{
										autocomplete: true,
										color: "#acc0e6",
										name: "Google",
										url: "https://www.google.de/search?q="
							},
							{
										autocomplete: true,
										color: "#ecb2b0",
										name: "Youtube",
										url: "https://www.youtube.com/results?search_query="
							},
							{
										autocomplete: true,
										color: "#e9b793",
										name: "Soundcloud",
										url: "https://soundcloud.com/search?q="
							},
							{
										autocomplete: false,
										color: "#ee9873",
										name: "DuckDuckGo",
										url: "https://duckduckgo.com/?q="
							}
				],
				sidebar: true,
				sidebar_websites: [
							{
										img: "github.png",
										name: "Github",
										url: "https://github.com/paulsae/startpage"
							}
				],
				weather: true
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

	chrome.storage.local.get("startpage_saved_colors", function(c){
		if(c.startpage_saved_colors == undefined){
			chrome.storage.local.set({startpage_saved_colors: []})
		}
	})
});

// MAIN

var redir = ['opera://startpage/', 'browser://startpage/', 'chrome://startpage/', 'chrome://startpage/#plus-button'];

var startpage_path = "/startpage/startpage.html"

chrome.tabs.onCreated.addListener(function(tab){

	console.log(tab)

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
	if(typeof(request.delay) != "number" || request.delay == undefined){
		request.delay = 0;
	}
	if (request.navigate == "home"){
		if(request.newTab == "true" || request.newTab === true){
			setTimeout(function(){
				chrome.tabs.create({
					url:"/startpage/startpage.html"
				});
			}, request.delay)
		} else if(request.newTab == "false" || request.newTab === false) {
			chrome.tabs.getSelected(function (tab) {
				setTimeout(function(){
					chrome.tabs.update(tab.id, {url:"/startpage/startpage.html"});
				}, request.delay)
			});
		}
	} else if(request.navigate != undefined){
		if(request.newTab == "true" || request.newTab === true){
			setTimeout(function(){
				chrome.tabs.create({
					url:request.navigate
				});
			}, request.delay)
		} else if(request.newTab == "false" || request.newTab === false) {
			chrome.tabs.getSelected(function (tab) {
				setTimeout(function(){
					chrome.tabs.update(tab.id, {url: request.navigate});
				}, request.delay)
			});
		}
	}

	if(request.action == "update_dark"){
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
	} else if(request.action == "closeCurrent") {
		chrome.tabs.getSelected(function(tab) {
			chrome.tabs.remove(tab.id, function() {});
		});
	}

	return true;
});