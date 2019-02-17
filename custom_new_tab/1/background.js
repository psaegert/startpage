var redir = ['opera://startpage/', 'browser://startpage/', 'chrome://startpage/'];

chrome.tabs.onCreated.addListener(function(tab){
	
	for (var i = 0; i < redir.length; i++) {
		if(tab.url === redir[i])
			break;
		if(i == redir.length - 1)
			return;
	};

	chrome.storage.local.get('startpage_path',function(e){

		if((typeof e.startpage_path) !== 'undefined'){

			for (var i = 0; i < redir.length; i++) 
				if(e.startpage_path.startsWith(redir[i].substr(0, redir[i].length - 1))) return;
	
			if(e.startpage_path.indexOf(':') == -1){
				e.startpage_path = 'http://' + e.startpage_path;
			}

			chrome.tabs.create({url:e.startpage_path});
		
		} else {
			chrome.tabs.create({
				url:"settings.htm"
			});
		}
		
		chrome.tabs.remove(tab.id);
	});
	
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.navigate == "home"){
			if(request.newTab == "true"){
				chrome.storage.local.get('startpage_path',function(e){
					if((typeof e.startpage_path) !== 'undefined'){
						chrome.tabs.create({
							url:e.startpage_path
						});
					} else {
						chrome.tabs.create({
							url:"settings.htm"
						});
					}
				});

			} else if(request.newTab == "false") {
				chrome.tabs.getSelected(function (tab) {
					chrome.storage.local.get('startpage_path',function(e){
						if((typeof e.startpage_path) !== 'undefined'){
							chrome.tabs.update(tab.id, {url: e.startpage_path});
						} else {
							chrome.tabs.create({
								url:"settings.htm"
							});
						}
					});

				});
			}
		} else {
			if(request.newTab == "true"){
				chrome.storage.local.get('startpage_path',function(e){
					if((typeof request.navigate) != 'undefined'){
						chrome.tabs.create({
							url:request.navigate
						});
					} else {
						chrome.tabs.create({
							url:"settings.htm"
						});
					}
				});

			} else if(request.newTab == "false") {
				chrome.tabs.getSelected(function (tab) {
					chrome.storage.local.get('startpage_path',function(e){
						if((typeof request.navigate) !== 'undefined'){
							chrome.tabs.update(tab.id, {url: request.navigate});
						} else {
							chrome.tabs.create({
								url:"settings.htm"
							});
						}
					});

				});
			}
		}
		return true;
	}
);
